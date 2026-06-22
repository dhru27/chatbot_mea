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

# --- DATA SCHEMAS ---
class ChatQuery(BaseModel):
    message: str
    category: Optional[str] = None
    ldap_id: Optional[str] = None

class TicketMessage(BaseModel):
    sender: str  # 'student', 'keshav', 'komal_mam'
    message: str
    is_internal_note: bool = False
    created_at: str

class TicketResponse(BaseModel):
    id: str
    ldap_id: str
    category: str
    status: str
    messages: List[TicketMessage]

# --- IN-MEMORY MOCK STORAGE (Acts as temporary database) ---
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
    "honors_minors_majors": {
        "retagging in honors": "Everything has been sent to the ASC portal. If you need to meet someone in person, visit the Academic Section (CC Building, 4th Floor).",
        "asc pr abhi tk nptel reflect nhi hua": "It is currently pending for half of the batch on the portal. Please wait for a few days.",
        "nptel came to asc but wrong tag": "Please email Komal Mam (komals@iitb.ac.in) and the Academic Office (aracad4@iitb.ac.in) specifying your current tag and the correct tag you want it changed to.",
        "two nptel courses showing as a single course": "Please write an email directly to Komal Mam (komals@iitb.ac.in) and the Academic Office (aracad4@iitb.ac.in) detailing both courses."
    },
    "dic_courses": {
        "course not reflected": "This is in progress and it will reflect soon. The backend procedure from the department side is fully completed.",
        "need to convert ce102 to me104 equivalent": "This is currently in process and under discussion with the department. We will post updates directly on the WhatsApp groups as soon as it is finalized."
    },
    "retagging_issues": {
        "error course is not part of course bulletin or undefined": "Please email Komal Mam (komals@iitb.ac.in) and the Academic Office (aracad4@iitb.ac.in) with a screenshot of the error.",
        "robotic minor not able to see its tag on asc": "Please type/provide your roll number here so we can track and update it for you manually."
    },
    "global_updates": {
        "course registration data": "Course registration data will come soon."
    }
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

    return f"""You are MEA Assistant, a helpful academic chatbot for Mechanical Engineering students at IIT Bombay.

RULES:
- Be concise, student-friendly, and clear. Hinglish is okay.
- Use the knowledge base and predecided answers below as your source of truth.
- If the question is about a specific personal issue (missing grades, specific certificate, individual course problem), say you cannot resolve personal issues and suggest the student escalate to Keshav or Komal Mam for help.
- For general academic questions (curriculum, timetable, slot clashes, department info), answer helpfully.
- Never invent instructors, deadlines, or ASC data. If unsure, say so.
- Do not ask for passwords, roll numbers, or API keys.

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
        "response": "I couldn't find an instant match for this specific issue. Would you like to escalate this query directly to Keshav and Komal Mam? They respond within 24 hours.",
        "escalate": True
    }

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
