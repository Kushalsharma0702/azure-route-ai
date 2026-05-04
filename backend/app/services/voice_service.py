"""
app.services.voice_service — Voice interaction business logic.

Orchestrates STT → LLM → TTS pipeline and persists voice sessions.
"""
import logging
from typing import Dict, Any, Optional, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.llm_adapter import LLMAdapter
from app.ai.prompt_templates import PromptTemplates
from app.ai.fallback import FallbackEngine
from app.integrations.sarvam_client import SarvamClient
from app.integrations.whisper_client import WhisperClient
from app.db.repositories.voice_session_repo import VoiceSessionRepository
from app.models.voice_session import VoiceSession
from app.core import settings

logger = logging.getLogger("voice_service")


class VoiceService:
    def __init__(self, db: AsyncSession):
        self.repo = VoiceSessionRepository(db)
        self.db = db

    async def chat(self, messages: List[Dict[str, str]], language: Optional[str], user_id: str) -> Dict[str, Any]:
        if not settings.USE_LLM:
            last_msg = messages[-1]["content"] if messages else ""
            fallback = FallbackEngine.voice_response(last_msg)
            return {"reply": fallback["response_text"], "mode": "rule-based", "language": language}

        system_prompt = PromptTemplates.voice_chat(language)
        conversation = "\n".join(f"{m['role']}: {m['content']}" for m in messages[-8:])

        llm_response = await LLMAdapter.call(conversation, system_prompt=system_prompt)

        if llm_response.is_error:
            return {"reply": "I ran into a problem. Please try again.", "mode": "error", "language": language}

        # Persist voice session
        session = VoiceSession(
            user_id=UUID(user_id),
            transcript=messages[-1]["content"] if messages else "",
            response=llm_response.text,
            language=language,
        )
        await self.repo.create(session)
        await self.repo.commit()

        tts_suggestion = {
            "speaker": settings.DEFAULT_SARVAM_SPEAKER, "pace": 0.98,
            "temperature": 0.7, "output_audio_codec": "mp3",
        }

        return {
            "reply": llm_response.text, "mode": "llm", "language": language,
            "session_id": str(session.id), "tts_suggestion": tts_suggestion,
        }

    async def speech_to_text(self, audio_bytes: bytes, filename: str, content_type: str, language: Optional[str] = None) -> Dict[str, Any]:
        return await WhisperClient.transcribe(audio_bytes, filename, content_type, language)

    async def text_to_speech(self, text: str, target_language_code: Optional[str] = None, speaker: str = "meera", pace: float = 1.0, temperature: float = 0.6, codec: str = "mp3") -> Dict[str, Any]:
        return await SarvamClient.synthesize_speech(text, target_language_code, speaker, pace=pace, temperature=temperature, output_audio_codec=codec)

    async def get_sessions(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Dict]:
        sessions = await self.repo.get_user_sessions(UUID(user_id), skip, limit)
        return [{"id": str(s.id), "transcript": s.transcript, "response": s.response, "language": s.language, "duration_ms": s.duration_ms, "created_at": s.created_at.isoformat()} for s in sessions]
