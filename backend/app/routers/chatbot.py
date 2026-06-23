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

LAST_UPDATED = "23 June 2026"

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
            "Thank you for reaching out! Regarding retagging in honors — everything has been sent to the ASC portal. "
            "If you need to meet someone in person, please visit the Academic Section (CC Building, 4th Floor). "
            "For any further clarification, feel free to reach out to Keshav (DGSec) or Komal Mam.\n\n"
            "📎 Reference: Academic Section, IIT Bombay"
        ),
    },
    "nptel": {
        "asc pr abhi tk nptel reflect nhi hua": (
            "Hi! We understand the concern. NPTEL course reflection on ASC is currently pending for a portion of the batch. "
            "Please give it a few more days — the Academic Office is processing the data. If it still doesn't reflect after a week, "
            "feel free to escalate through this chat and we'll follow up with the office directly.\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
        ),
        "nptel came to asc but wrong tag": (
            "We're sorry to hear about the tagging issue! To get this corrected, please send an email to:\n\n"
            "• Komal Mam — komals@iitb.ac.in\n"
            "• Academic Office — aracad4@iitb.ac.in\n\n"
            "In your email, please mention your current tag and the correct tag you'd like it changed to. "
            "This is usually resolved within a few working days.\n\n"
            "📎 Reference: Academic Office retagging process"
        ),
        "two nptel courses showing as a single course": (
            "That does happen occasionally during data entry. To fix this, please write an email directly to:\n\n"
            "• Komal Mam — komals@iitb.ac.in\n"
            "• Academic Office — aracad4@iitb.ac.in\n\n"
            "Please include the details of both NPTEL courses (course names, certificate numbers) so they can be separated correctly.\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
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
            "Thank you for flagging this! We'd like to assure you that the course reflection is currently in progress "
            "and should appear on the portal soon. The backend procedure from the department side has been fully completed. "
            "If it doesn't reflect within the next few days, please don't hesitate to reach out again.\n\n"
            "📎 Reference: ME Department Office"
        ),
        "need to convert ce102 to me104 equivalent": (
            "This is a great question! The CE102 to ME104 equivalence conversion is currently in process and under active "
            "discussion with the department. We will post updates directly on the official WhatsApp groups as soon as it is finalized. "
            "Thank you for your patience!\n\n"
            "📎 Reference: ME DUGC"
        ),
    },
    "retagging_issues": {
        "error course is not part of course bulletin or undefined": (
            "We understand this can be frustrating! To resolve this error, please send an email with a screenshot of the error to:\n\n"
            "• Komal Mam — komals@iitb.ac.in\n"
            "• Academic Office — aracad4@iitb.ac.in\n\n"
            "They'll be able to look into it and fix the course bulletin entry. This usually takes 2–3 working days.\n\n"
            "📎 Reference: Academic Office, IIT Bombay"
        ),
        "robotic minor not able to see its tag on asc": (
            "Thank you for bringing this up! We'll need your roll number to track and update this manually. "
            "Could you please share it here or reach out to Keshav (DGSec) directly? "
            "You can contact him at (+91) 78765 61677.\n\n"
            "📎 Reference: ME Department Office"
        ),
    },
    "contact_info": {
        "contact keshav": (
            "Here are Keshav's contact details:\n\n"
            "👤 Keshav — Department General Secretary (DGSec), Mechanical Engineering\n"
            "📱 Phone: (+91) 78765 61677\n\n"
            "Feel free to reach out to him for any academic or department-related queries!"
        ),
        "contact komal mam": (
            "Here are Komal Mam's contact details:\n\n"
            "👤 Komal Mam — Academic Office, Mechanical Engineering Department\n"
            "📞 Phone: (+91) 22 - 2576 7502\n"
            "📧 Email: komals@iitb.ac.in\n\n"
            "She handles retagging, NPTEL equivalences, and academic records. Feel free to reach out!"
        ),
        "keshav phone": (
            "Keshav's phone number is (+91) 78765 61677. He is the current Department General Secretary (DGSec) for Mechanical Engineering."
        ),
        "komal mam email": (
            "Komal Mam's email is komals@iitb.ac.in and her phone number is (+91) 22 - 2576 7502."
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
- Keshav (DGSec): Phone (+91) 78765 61677
- Komal Mam: Phone (+91) 22-2576 7502, Email komals@iitb.ac.in
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
