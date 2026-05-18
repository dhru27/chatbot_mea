import logging
from pathlib import Path
from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages"
DEFAULT_KNOWLEDGE_DIR = Path(__file__).resolve().parents[1] / "chatbot" / "knowledge"


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class ChatSource(BaseModel):
    title: str
    url: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
    model: str


VERIFIED_SOURCES = [
    ChatSource(
        title="IIT Bombay Mechanical Engineering Undergraduate Academics",
        url="https://www.me.iitb.ac.in/undergraduate-academics",
    ),
    ChatSource(
        title="IIT Bombay Academic Office Calendar and Timetable",
        url="https://acad.iitb.ac.in/academics/calendar-and-timetable",
    ),
    ChatSource(
        title="IIT Bombay ASC Course Information",
        url="https://portal.iitb.ac.in/asc/Courses",
    ),
    ChatSource(
        title="IIT Bombay Mechanical Engineering Faculty Directory",
        url="https://www.me.iitb.ac.in/full-time-faculty",
    ),
    ChatSource(
        title="MEA IIT Bombay Website",
        url="https://mea.netlify.app/",
    ),
    ChatSource(
        title="ResoBin IIT Bombay",
        url="https://resobin.gymkhana.iitb.ac.in/login",
    ),
]


def _knowledge_dir() -> Path:
    if settings.CHATBOT_KNOWLEDGE_DIR:
        return Path(settings.CHATBOT_KNOWLEDGE_DIR)
    return DEFAULT_KNOWLEDGE_DIR


def load_knowledge_base() -> str:
    knowledge_dir = _knowledge_dir()
    if not knowledge_dir.exists():
        logger.warning("Chatbot knowledge directory does not exist: %s", knowledge_dir)
        return ""

    sections: list[str] = []
    for path in sorted(knowledge_dir.glob("*.md")):
        try:
            sections.append(f"\n\n---\nSOURCE FILE: {path.name}\n{path.read_text(encoding='utf-8')}")
        except OSError as exc:
            logger.warning("Unable to read chatbot knowledge file %s: %s", path, exc)

    return "\n".join(sections).strip()


def build_system_prompt() -> str:
    knowledge = load_knowledge_base()
    return f"""
You are MEA Assistant, a helpful academic chatbot for Mechanical Engineering students at IIT Bombay.

Use the verified knowledge base below as your source of truth. You may also use general reasoning for
time-overlap calculations, study-planning explanations, and navigation guidance, but do not invent
current instructors, live ASC data, institute rules, deadlines, or private ResoBin content.

Response rules:
- Be concise, student-friendly, and clear. Hinglish is okay if the student writes in Hinglish.
- For slot clashes, explain the method: compare the day plus overlapping time intervals; if two
  courses overlap at any point, treat it as a clash and ask the student to verify final registration
  eligibility on ASC.
- If the answer depends on current ASC/resobin/login-only data, say that live login data is not
  available to the bot and point the student to ASC or ResoBin.
- Mention source names or URLs when giving factual academic information.
- If you are unsure or the knowledge base does not contain the answer, say so and suggest the most
  reliable place to verify it.
- Do not ask for or store passwords, roll numbers, API keys, or other sensitive data.

Verified knowledge base:
{knowledge}
""".strip()


def build_anthropic_messages(request: ChatRequest) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []
    for item in request.history[-12:]:
        content = item.content.strip()
        if not content:
            continue
        if not messages and item.role == "assistant":
            continue
        if messages and messages[-1]["role"] == item.role:
            messages[-1]["content"] = f"{messages[-1]['content']}\n\n{content}"
            continue
        messages.append({"role": item.role, "content": content})

    current_message = request.message.strip()
    if messages and messages[-1]["role"] == "user":
        messages[-1]["content"] = f"{messages[-1]['content']}\n\n{current_message}"
    else:
        messages.append({"role": "user", "content": current_message})
    return messages


def extract_text_from_anthropic_response(payload: dict) -> str:
    content_blocks = payload.get("content", [])
    parts = [
        block.get("text", "")
        for block in content_blocks
        if isinstance(block, dict) and block.get("type") == "text"
    ]
    return "\n".join(part for part in parts if part).strip()


@router.post("/ask", response_model=ChatResponse)
async def ask_chatbot(request: ChatRequest) -> ChatResponse:
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Claude is not configured yet. Set ANTHROPIC_API_KEY on the backend.",
        )

    payload = {
        "model": settings.ANTHROPIC_MODEL,
        "max_tokens": settings.ANTHROPIC_MAX_TOKENS,
        "temperature": 0.2,
        "system": build_system_prompt(),
        "messages": build_anthropic_messages(request),
    }
    headers = {
        "x-api-key": settings.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            response = await client.post(ANTHROPIC_MESSAGES_URL, headers=headers, json=payload)
    except httpx.TimeoutException as exc:
        logger.warning("Anthropic request timed out: %s", exc)
        raise HTTPException(status_code=504, detail="Claude took too long to respond.") from exc
    except httpx.HTTPError as exc:
        logger.exception("Anthropic request failed")
        raise HTTPException(status_code=502, detail="Unable to reach Claude right now.") from exc

    if response.status_code >= 400:
        logger.warning("Anthropic API error %s: %s", response.status_code, response.text)
        detail = "Claude returned an error. Check the backend API key/model configuration."
        if response.status_code == 401:
            detail = "Claude API key was rejected. Check ANTHROPIC_API_KEY."
        raise HTTPException(status_code=502, detail=detail)

    answer = extract_text_from_anthropic_response(response.json())
    if not answer:
        raise HTTPException(status_code=502, detail="Claude returned an empty response.")

    return ChatResponse(answer=answer, sources=VERIFIED_SOURCES, model=settings.ANTHROPIC_MODEL)
