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

LAST_UPDATED = "12 August 2026"

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
    assigned_to: str
    messages: List[TicketMessage]

class FAQEntry(BaseModel):
    id: str
    question: str
    answer: str
    answered_by: str
    category: str
    source: str
    created_at: str

class SaveToFAQRequest(BaseModel):
    question: str
    answer: str
    answered_by: str
    category: Optional[str] = "general"
    source: Optional[str] = ""

# --- ROUTING CONFIG ---
ROUTING_RULES = {
    "academic": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
    "events": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
    "placements": {"first_responder": "keshav", "escalate_to": "komal_mam", "label": "Keshav (DGSec)"},
    "internships": {"first_responder": "keshav", "escalate_to": "komal_mam", "label": "Keshav (DGSec)"},
    "honors": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
    "nptel": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
    "dic_courses": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
    "retagging_issues": {"first_responder": "sri_krishna", "escalate_to": "keshav", "label": "Sri Krishna (CACL)"},
}
DEFAULT_ROUTE = {"first_responder": "keshav", "escalate_to": "komal_mam", "label": "Keshav (DGSec)"}

SENDER_LABELS = {
    "keshav": "Keshav (DGSec)",
    "sri_krishna": "Sri Krishna (CACL)",
    "komal_mam": "Komal Ma'am (Academic Office)",
    "department": "ME Department",
    "academic_office": "Academic Office",
}

# --- IN-MEMORY STORAGE ---
MOCK_TICKETS: List[dict] = [
    {
        "id": "mock-ticket-1",
        "ldap_id": "25b2112",
        "category": "nptel",
        "status": "open",
        "assigned_to": "sri_krishna",
        "messages": [
            {"sender": "student", "message": "My NPTEL course is not showing up on the ASC portal.", "is_internal_note": False, "created_at": "2026-06-22 14:00"}
        ]
    }
]

LEARNED_FAQ: List[dict] = []

QUERY_LOG: List[dict] = []

PREDECIDED_KNOWLEDGE = {
    "honors": {
        "retagging in honors": (
            "The request for Honors retagging has already been submitted through the ASC portal from the department side. "
            "At this stage, students are advised to wait or visit the ASC Office (CC Building, 4th Floor) for further status or action if required.\n\n"
            "📎 Reference: Academic Section, IIT Bombay\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
    },
    "nptel": {
        "asc pr abhi tk nptel reflect nhi hua": (
            "This issue is currently pending for a section of the batch and is not specific to an individual student. "
            "It is already under process, so please wait a few more days for the course to reflect on ASC before raising it separately.\n\n"
            "📎 Reference: Academic Office, IIT Bombay\n"
            "✅ Answered by: Keshav (DGSec)"
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
            "📎 Reference: Academic Office retagging process\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
        "two nptel courses showing as a single course": (
            "If two of your NPTEL courses are appearing as a single entry on ASC, please email Komal Ma'am and the Academic Office "
            "with complete details of both courses, including course names and relevant screenshots if possible. "
            "This issue needs to be corrected from the backend.\n\n"
            "📧 Komal Ma'am: komals@iitb.ac.in\n"
            "📧 Academic Office: aracad4@iitb.ac.in\n\n"
            "📎 Reference: Academic Office, IIT Bombay\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
        "nptel not being counted towards credits": (
            "This issue has already been communicated from the department side, and the Academic Office is aware of it. "
            "It is expected to be resolved from their end shortly. No separate action is required from students at the moment "
            "unless specifically asked later.\n\n"
            "📎 Reference: ME Department & Academic Office\n"
            "✅ Answered by: Keshav (DGSec)"
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
            "📎 Reference: NPTEL website (https://onlinecourses.nptel.ac.in/) & ME Department guidelines\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
    },
    "dic_courses": {
        "course not reflected": (
            "The department-side process for DIC courses has already been completed. The course should reflect on ASC soon "
            "once the remaining backend updates are processed. Please wait for some time before raising it individually.\n\n"
            "📎 Reference: ME Department Office\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
        "need to convert ce102 to me104 equivalent": (
            "The CE102 to ME104 conversion matter is currently under discussion with the department. "
            "Once there is a confirmed update, it will be communicated on the official WhatsApp groups. "
            "Please rely on those updates instead of raising the same query individually.\n\n"
            "📎 Reference: ME DUGC\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
    },
    "retagging_issues": {
        "error course is not part of course bulletin or undefined": (
            "If you are getting a \"course not in bulletin\" error while trying to retag, please email Komal Ma'am and the Academic Office "
            "along with a screenshot of the error. This will help them identify the issue and resolve it from their side.\n\n"
            "📧 Komal Ma'am: komals@iitb.ac.in\n"
            "📧 Academic Office: aracad4@iitb.ac.in\n\n"
            "📎 Reference: Academic Office, IIT Bombay\n"
            "✅ Answered by: Keshav (DGSec)"
        ),
        "robotic minor not able to see its tag on asc": (
            "If your Robotics minor tag is not showing on ASC, please share your roll number so that the case can be tracked manually from our side. "
            "You can contact Keshav or Komal Ma'am directly for this.\n\n"
            "👤 Keshav (DGSec): (+91) 78765 61677 | gsec@me.iitb.ac.in\n"
            "👤 Komal Ma'am: komals@iitb.ac.in\n\n"
            "📎 Reference: ME Department Office\n"
            "✅ Answered by: Keshav (DGSec)"
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
        "contact sri krishna": (
            "Here are Sri Krishna's contact details:\n\n"
            "👤 Sri Krishna — CACL (Council for Academic and Curricular Life)\n\n"
            "He handles academic-related escalations and event queries for the department."
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


def get_learned_faq_text() -> str:
    if not LEARNED_FAQ:
        return ""
    lines = ["--- LEARNED FAQ (from admin answers) ---"]
    for entry in LEARNED_FAQ:
        lines.append(f"\nQ: {entry['question']}")
        lines.append(f"A: {entry['answer']}")
        lines.append(f"Answered by: {entry['answered_by']} | Category: {entry['category']} | Source: {entry.get('source', 'Direct answer')}")
    return "\n".join(lines)


def build_system_prompt() -> str:
    knowledge = load_knowledge_base()
    faq_text = get_learned_faq_text()
    rules_summary = ""
    for cat, rules in PREDECIDED_KNOWLEDGE.items():
        rules_summary += f"\n[{cat}]\n"
        for key, val in rules.items():
            rules_summary += f"  Q: {key}\n  A: {val}\n"

    return f"""You are MEA Assistant, a helpful and polite academic chatbot for Mechanical Engineering students at IIT Bombay.

RULES:
- Be polite, formal yet friendly. Never give one-line curt answers. Always be helpful and warm.
- Use the knowledge base, FAQ, and predecided answers below as your source of truth.
- Always mention the source/reference for factual information.
- Always include "✅ Answered by:" attribution at the end of your response.
- Include relevant links when available.
- If the question is about a specific personal issue, suggest the student escalate through this chat.
- For general academic questions, answer helpfully with references.
- Never invent instructors, deadlines, or ASC data. If unsure, say so.
- Do not ask for passwords, roll numbers, or API keys.
- Keshav is the current Department General Secretary (DGSec) of Mechanical Engineering.
- Sri Krishna is the CACL (Council for Academic and Curricular Life).

CONTACT INFORMATION:
- Keshav (DGSec): Phone (+91) 78765 61677, Email gsec@me.iitb.ac.in
- Sri Krishna (CACL): Handles academic queries and events
- Komal Ma'am: Phone (+91) 22-2576 7502, Email komals@iitb.ac.in
- Academic Office: Email aracad4@iitb.ac.in
- ME Department: Phone (+91) 22-2576 7501/02/03, Email office.me@iitb.ac.in

ROUTING:
- Academic/Events queries go to Sri Krishna (CACL) first, then escalate to Keshav.
- Placements/Internships/Other queries go to Keshav first, then escalate to Komal Ma'am.

PREDECIDED ANSWERS (use these verbatim if the question matches):
{rules_summary}

{faq_text}

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


def get_route_for_category(category: Optional[str]) -> dict:
    if category and category in ROUTING_RULES:
        return ROUTING_RULES[category]
    return DEFAULT_ROUTE


# --- STUDENT CHAT ENDPOINT ---
@router.post("/ask")
async def ask_chatbot(payload: ChatQuery):
    user_msg = payload.message.strip().lower()
    cat = payload.category

    # Log the query
    QUERY_LOG.append({
        "id": str(uuid.uuid4()),
        "question": payload.message,
        "category": cat,
        "ldap_id": payload.ldap_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "answered": False,
        "answer_source": None,
    })

    # 1. Match against hardcoded responses
    if cat in PREDECIDED_KNOWLEDGE:
        for rule_key, rule_answer in PREDECIDED_KNOWLEDGE[cat].items():
            if rule_key in user_msg or user_msg in rule_key:
                QUERY_LOG[-1]["answered"] = True
                QUERY_LOG[-1]["answer_source"] = "predecided"
                return {"source": "rule_matrix", "response": rule_answer, "escalate": False, "answered_by": "Keshav (DGSec)"}

    for cat_key in PREDECIDED_KNOWLEDGE:
        for rule_key, rule_answer in PREDECIDED_KNOWLEDGE[cat_key].items():
            if rule_key in user_msg:
                QUERY_LOG[-1]["answered"] = True
                QUERY_LOG[-1]["answer_source"] = "predecided"
                return {"source": "rule_matrix", "response": rule_answer, "escalate": False, "answered_by": "Keshav (DGSec)"}

    # 2. Check learned FAQ
    for faq in LEARNED_FAQ:
        faq_q = faq["question"].lower()
        if faq_q in user_msg or user_msg in faq_q:
            QUERY_LOG[-1]["answered"] = True
            QUERY_LOG[-1]["answer_source"] = "learned_faq"
            response_text = faq["answer"]
            if faq.get("source"):
                response_text += f"\n\n📎 Source: {faq['source']}"
            response_text += f"\n✅ Answered by: {SENDER_LABELS.get(faq['answered_by'], faq['answered_by'])}"
            return {"source": "learned_faq", "response": response_text, "escalate": False, "answered_by": faq["answered_by"]}

    # 3. Try OpenAI AI fallback
    ai_answer = await ask_openai(payload.message, cat)
    if ai_answer:
        QUERY_LOG[-1]["answered"] = True
        QUERY_LOG[-1]["answer_source"] = "ai"
        return {"source": "ai_agent", "response": ai_answer, "escalate": False, "answered_by": "MEA AI Assistant"}

    # 4. Escalation with routing
    route = get_route_for_category(cat)
    QUERY_LOG[-1]["answer_source"] = "escalated"
    return {
        "source": "escalation",
        "response": (
            f"I wasn't able to find an answer for this specific query. "
            f"This will be routed to {route['label']} for a response. "
            f"Would you like to forward your query? They typically respond within 24 hours.\n\n"
            f"You can also reach Keshav directly at (+91) 78765 61677."
        ),
        "escalate": True,
        "route_to": route["first_responder"],
        "answered_by": None,
    }

@router.get("/meta")
async def get_meta():
    return {"last_updated": LAST_UPDATED, "faq_count": len(LEARNED_FAQ), "total_queries": len(QUERY_LOG)}

# --- FAQ ENDPOINTS ---
@router.post("/faq")
async def save_to_faq(payload: SaveToFAQRequest):
    entry = {
        "id": str(uuid.uuid4()),
        "question": payload.question,
        "answer": payload.answer,
        "answered_by": payload.answered_by,
        "category": payload.category or "general",
        "source": payload.source or "Direct answer",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    LEARNED_FAQ.append(entry)
    return {"status": "success", "faq_entry": entry}

@router.get("/faq", response_model=List[FAQEntry])
async def get_faq():
    return LEARNED_FAQ

@router.get("/queries")
async def get_query_log():
    return {"queries": QUERY_LOG[-100:], "total": len(QUERY_LOG)}

# --- ESCALATION & ADMIN DASHBOARD ENDPOINTS ---
@router.post("/tickets")
async def create_ticket(payload: ChatQuery):
    if not payload.ldap_id:
        raise HTTPException(status_code=400, detail="LDAP ID is required to create a ticket.")
    
    route = get_route_for_category(payload.category)
    
    new_ticket = {
        "id": str(uuid.uuid4()),
        "ldap_id": payload.ldap_id,
        "category": payload.category or "any_other_issue",
        "status": "open",
        "assigned_to": route["first_responder"],
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
    return {"status": "success", "ticket": new_ticket, "routed_to": route["label"]}

@router.get("/admin/tickets", response_model=List[TicketResponse])
async def get_all_tickets():
    return MOCK_TICKETS

@router.post("/admin/tickets/{ticket_id}/reply")
async def admin_reply(ticket_id: str, sender: str, message: str, is_internal_note: bool = False, save_as_faq: bool = False, original_question: Optional[str] = None):
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

            if save_as_faq and not is_internal_note:
                question = original_question or ticket["messages"][0]["message"]
                faq_entry = {
                    "id": str(uuid.uuid4()),
                    "question": question,
                    "answer": message,
                    "answered_by": sender,
                    "category": ticket["category"],
                    "source": f"Ticket {ticket_id[:8]} — answered by {SENDER_LABELS.get(sender, sender)}",
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                }
                LEARNED_FAQ.append(faq_entry)
                return {"status": "success", "ticket": ticket, "faq_saved": True, "faq_entry": faq_entry}

            return {"status": "success", "ticket": ticket, "faq_saved": False}
    raise HTTPException(status_code=404, detail="Ticket not found")

@router.post("/admin/tickets/{ticket_id}/reassign")
async def reassign_ticket(ticket_id: str, assign_to: str):
    for ticket in MOCK_TICKETS:
        if ticket["id"] == ticket_id:
            ticket["assigned_to"] = assign_to
            ticket["messages"].append({
                "sender": "system",
                "message": f"Ticket reassigned to {SENDER_LABELS.get(assign_to, assign_to)}",
                "is_internal_note": True,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
            })
            return {"status": "success", "ticket": ticket}
    raise HTTPException(status_code=404, detail="Ticket not found")
