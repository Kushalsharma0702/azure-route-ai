"""
app.integrations.whisper_client — OpenAI Whisper STT client.
"""
import logging
from typing import Optional
import httpx
from app.core import settings

logger = logging.getLogger("whisper_client")


class WhisperClient:
    @classmethod
    async def transcribe(cls, audio_bytes: bytes, filename: str = "audio.wav",
                         content_type: str = "application/octet-stream",
                         language: Optional[str] = None) -> dict:
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            return {"error": "OPENAI_API_KEY not set for Whisper STT"}

        url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {api_key}"}
        data = {"model": "whisper-1"}
        if language:
            data["language"] = language
        files = {"file": (filename, audio_bytes, content_type)}

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                resp = await client.post(url, headers=headers, data=data, files=files)
            if resp.status_code >= 400:
                return {"error": resp.text, "status_code": resp.status_code}
            resp_json = resp.json()
            return {"text": resp_json.get("text", ""), "raw": resp_json}
        except Exception as e:
            logger.exception("Whisper STT failed")
            return {"error": str(e)}
