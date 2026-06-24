import logging
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"
DEFAULT_KNOWLEDGE_DIR = Path(__file__).resolve().parents[1] / "chatbot" / "knowledge"

LAST_UPDATED = "24 June 2026"

# --- DATA SCHEMAS ---
class ChatQuery(BaseModel):
    message: str
    category: Optional[str] = None
    ldap_id: Optional[str] = None

class TicketMessage(BaseModel):
    sender: str
    message: str
    is_internal_note: bool = False
    created_at: str

class TicketResponse(BaseModel):
    id: str
    ldap_id: str
    category: str
    status: str
    messages: List[TicketMessage]

# --- IN-MEMORY MOCK STORAGE ---
MOCK_TICKETS = [
    {
        "id": "mock-ticket-1",
        "ldap_id": "25b2112",
        "category": "honors_minors_majors",
        "status": "open",
        "messages": [
            {"sender": "student", "message": "My NPTEL course is not showing up on the ASC portal.", "is_internal_note": False, "created_at": "2026-06-22 14:00"}
        ]
    }
]

PREDECIDED_KNOWLEDGE = {
    "honors": {
        "retagging in honors": (
            "The request for Honors retagging has already been submitted through the ASC portal from the department side. "
            "At this stage, students are advised to wait or visit the ASC Office (CC Building, 4th Floor) for further status or action if required.\n\n"
            "📎 Reference: Academic Section, IIT Bombay"
        ),
    },
    "nptel": {
        "asc pr abhi tk nptel reflect nhi hua": (
            "This issue is currently pending for a section of the batch and is not specific to an individual student. "
            "It is already under process, so please wait a few more days for the course to reflect on ASC before raising it separately.\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
        ),
        "nptel came to asc but wrong tag": (
            "If your NPTEL course is visible on ASC but has been tagged incorrectly, please email Komal Ma'am and the Academic Office, clearly mentioning:\n\n"
            "• Your name and roll number\n"
            "• The NPTEL course name\n"
            "• The tag currently shown on ASC\n"
            "• The correct tag that should be applied\n\n"
            "This will help them process the correction directly.\n\n"
            "📧 Komal Ma'am: komals@iitb.ac.in\n"
            "📧 Academic Office: aracad4@iitb.ac.in\n\n"
            "📎 Reference: Academic Office retagging process"
        ),
        "two nptel courses showing as a single course": (
            "If two of your NPTEL courses are appearing as a single entry on ASC, please email Komal Ma'am and the Academic Office "
            "with complete details of both courses, including course names and relevant screenshots if possible. "
            "This issue needs to be corrected from the backend.\n\n"
            "📧 Komal Ma'am: komals@iitb.ac.in\n"
            "📧 Academic Office: aracad4@iitb.ac.in\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
        ),
        "nptel not being counted towards credits": (
            "This issue has already been communicated from the department side, and the Academic Office is aware of it. "
            "It is expected to be resolved from their end shortly. No separate action is required from students at the moment "
            "unless specifically asked later.\n\n"
            "📎 Reference: ME Department & Academic Office"
        ),
        "nptel process": (
            "Here's the step-by-step process for completing electives through NPTEL:\n\n"
            "1. Find a 12-week NPTEL course on https://onlinecourses.nptel.ac.in/ — must be run by an IIT faculty (hard rule).\n"
            "2. Fill the Student NPTEL Course Equivalence form with all your planned courses and total credits.\n"
            "3. Mention the course name and code clearly.\n"
            "4. Provide the equivalent 6-credit IITB course(s).\n"
            "5. Get signature from the IITB faculty who taught the equivalent course.\n"
            "6. Get your Faculty Advisor's signature.\n"
            "7. Register on the NPTEL website via LDAP only. Use the same name as on your IITB ID card.\n\n"
            "After completion, DGSec will float a form to upload your passing certificate. The course will then appear on your transcript.\n\n"
            "📎 Reference: NPTEL website (https://onlinecourses.nptel.ac.in/) & ME Department guidelines"
        ),
    },
    "dic_courses": {
        "course not reflected": (
            "The department-side process for DIC courses has already been completed. The course should reflect on ASC soon "
            "once the remaining backend updates are processed. Please wait for some time before raising it individually.\n\n"
            "📎 Reference: ME Department Office"
        ),
        "need to convert ce102 to me104 equivalent": (
            "The CE102 to ME104 conversion matter is currently under discussion with the department. "
            "Once there is a confirmed update, it will be communicated on the official WhatsApp groups. "
            "Please rely on those updates instead of raising the same query individually.\n\n"
            "📎 Reference: ME DUGC"
        ),
    },
    "retagging_issues": {
        "error course is not part of course bulletin or undefined": (
            "If you are getting a \"course not in bulletin\" error while trying to retag, please email Komal Ma'am and the Academic Office "
            "along with a screenshot of the error. This will help them identify the issue and resolve it from their side.\n\n"
            "📧 Komal Ma'am: komals@iitb.ac.in\n"
            "📧 Academic Office: aracad4@iitb.ac.in\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
        ),
        "robotic minor not able to see its tag on asc": (
            "If your Robotics minor tag is not showing on ASC, please share your roll number so that the case can be tracked manually from our side. "
            "You can contact Keshav or Komal Ma'am directly for this.\n\n"
            "👤 Keshav (DGSec): (+91) 78765 61677 | gsec@me.iitb.ac.in\n"
            "👤 Komal Ma'am: komals@iitb.ac.in\n\n"
            "📎 Reference: ME Department Office"
        ),
    },
    "contact_info": {
        "contact keshav": (
            "Here are Keshav's contact details:\n\n"
            "👤 Keshav — Department General Secretary (DGSec), Mechanical Engineering\n"
            "📱 Phone: (+91) 78765 61677\n"
            "📧 Email: gsec@me.iitb.ac.in\n\n"
            "Feel free to reach out to him for any academic or department-related queries!"
        ),
        "contact komal mam": (
            "Here are Komal Ma'am's contact details:\n\n"
            "👤 Komal Ma'am — Academic Office, Mechanical Engineering Department\n"
            "📞 Phone: (+91) 22 - 2576 7502\n"
            "📧 Email: komals@iitb.ac.in\n\n"
            "She handles retagging, NPTEL equivalences, and academic records. Feel free to reach out!"
        ),
        "contact academic office": (
            "Here are the Academic Office contact details:\n\n"
            "📧 Email: aracad4@iitb.ac.in\n\n"
            "You can reach out to them for retagging issues, course bulletin corrections, and general academic queries."
        ),
        "keshav phone": (
            "Keshav's phone number is (+91) 78765 61677 and his email is gsec@me.iitb.ac.in. "
            "He is the current Department General Secretary (DGSec) for Mechanical Engineering."
        ),
        "komal mam email": (
            "Komal Ma'am's email is komals@iitb.ac.in and her phone number is (+91) 22 - 2576 7502."
        ),
    },
}


# --- KNOWLEDGE BASE LOADER ---
def load_knowledge_base() -> str:
    knowledge_dir = DEFAULT_KNOWLEDGE_DIR
    if settings.CHATBOT_KNOWLEDGE_DIR:
        knowledge_dir = Path(settings.CHATBOT_KNOWLEDGE_DIR)
    if not knowledge_dir.exists():
        return ""
    sections: list[str] = []
    for path in sorted(knowledge_dir.glob("*.md")):
        try:
            sections.append(f"--- {path.name} ---\n{path.read_text(encoding='utf-8')}")
        except OSError:
            pass
    return "\n\n".join(sections).strip()


def build_system_prompt() -> str:
    knowledge = load_knowledge_base()
    rules_summary = ""
    for cat, rules in PREDECIDED_KNOWLEDGE.items():
        rules_summary += f"\n[{cat}]\n"
        for key, val in rules.items():
            rules_summary += f"  Q: {key}\n  A: {val}\n"

    return f"""You are MEA Assistant, a helpful and polite academic chatbot for Mechanical Engineering students at IIT Bombay.

RULES:
- Be polite, formal yet friendly. Never give one-line curt answers. Always be helpful and warm.
- Use the knowledge base and predecided answers below as your source of truth.
- Always mention the source/reference for factual information.
- Include relevant links when available.
- If the question is about a specific personal issue (missing grades, specific certificate, individual course problem), suggest the student reach out to Keshav (DGSec, phone: +91 78765 61677) or Komal Mam (email: komals@iitb.ac.in, phone: +91 22-2576 7502) for personalized help.
- For general academic questions (curriculum, timetable, slot clashes, electives, academic calendar), answer helpfully with references.
- Never invent instructors, deadlines, or ASC data. If unsure, say so.
- Do not ask for passwords, roll numbers, or API keys.
- Keshav is the current Department General Secretary (DGSec) of Mechanical Engineering.

CONTACT INFORMATION:
- Keshav (DGSec): Phone (+91) 78765 61677, Email gsec@me.iitb.ac.in
- Komal Ma'am: Phone (+91) 22-2576 7502, Email komals@iitb.ac.in
- Academic Office: Email aracad4@iitb.ac.in
- ME Department: Phone (+91) 22-2576 7501/02/03, Email office.me@iitb.ac.in

PREDECIDED ANSWERS (use these verbatim if the question matches):
{rules_summary}

KNOWLEDGE BASE:
{knowledge}"""


# --- OPENAI AI FALLBACK ---
async def ask_openai(user_message: str, category: Optional[str] = None) -> Optional[str]:
    if not settings.OPENAI_API_KEY:
        return None

    try:
        system_prompt = build_system_prompt()
        if category:
            system_prompt += f"\n\nThe student selected category: {category}"

        payload = {
            "model": settings.OPENAI_MODEL,
            "max_tokens": settings.OPENAI_MAX_TOKENS,
            "temperature": 0.3,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        }
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(OPENAI_CHAT_URL, headers=headers, json=payload)

        if response.status_code >= 400:
            logger.warning("OpenAI API error %s: %s", response.status_code, response.text)
            return None

        data = response.json()
        choices = data.get("choices", [])
        if not choices:
            return None
        return (choices[0].get("message", {}).get("content") or "").strip() or None

    except Exception as exc:
        logger.warning("OpenAI fallback failed: %s", exc)
        return None


# --- STUDENT CHAT ENDPOINT ---
@router.post("/ask")
async def ask_chatbot(payload: ChatQuery):
    user_msg = payload.message.strip().lower()
    cat = payload.category

    # 1. Match against hardcoded responses
    if cat in PREDECIDED_KNOWLEDGE:
        for rule_key, rule_answer in PREDECIDED_KNOWLEDGE[cat].items():
            if rule_key in user_msg or user_msg in rule_key:
                return {"source": "rule_matrix", "response": rule_answer, "escalate": False}

    for cat_key in PREDECIDED_KNOWLEDGE:
        for rule_key, rule_answer in PREDECIDED_KNOWLEDGE[cat_key].items():
            if rule_key in user_msg:
                return {"source": "rule_matrix", "response": rule_answer, "escalate": False}

    # 2. Try OpenAI AI fallback
    ai_answer = await ask_openai(payload.message, cat)
    if ai_answer:
        return {"source": "ai_agent", "response": ai_answer, "escalate": False}

    # 3. If AI also couldn't help, trigger escalation
    return {
        "source": "escalation",
        "response": (
            "I wasn't able to find an answer for this specific query. "
            "Would you like to escalate this directly to Keshav (DGSec) and Komal Mam? "
            "They typically respond within 24 hours. You can also reach Keshav directly at (+91) 78765 61677."
        ),
        "escalate": True
    }

@router.get("/meta")
async def get_meta():
    return {"last_updated": LAST_UPDATED}

# --- ESCALATION & ADMIN DASHBOARD ENDPOINTS ---
@router.post("/tickets")
async def create_ticket(payload: ChatQuery):
    if not payload.ldap_id:
        raise HTTPException(status_code=400, detail="LDAP ID is required to create a ticket.")
    
    new_ticket = {
        "id": str(uuid.uuid4()),
        "ldap_id": payload.ldap_id,
        "category": payload.category or "any_other_issue",
        "status": "open",
        "messages": [
            {
                "sender": "student",
                "message": payload.message,
                "is_internal_note": False,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
            }
        ]
    }
    MOCK_TICKETS.append(new_ticket)
    return {"status": "success", "ticket": new_ticket}

@router.get("/admin/tickets", response_model=List[TicketResponse])
async def get_all_tickets():
    return MOCK_TICKETS

@router.post("/admin/tickets/{ticket_id}/reply")
async def admin_reply(ticket_id: str, sender: str, message: str, is_internal_note: bool = False):
    for ticket in MOCK_TICKETS:
        if ticket["id"] == ticket_id:
            ticket["messages"].append({
                "sender": sender,
                "message": message,
                "is_internal_note": is_internal_note,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
            })
            if not is_internal_note:
                ticket["status"] = "investigating"
            return {"status": "success", "ticket": ticket}
    raise HTTPException(status_code=404, detail="Ticket not found")
