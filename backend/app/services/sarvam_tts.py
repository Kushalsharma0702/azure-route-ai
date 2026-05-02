import os
import logging
from typing import Optional
import httpx

try:
    from langdetect import detect
except Exception:  # pragma: no cover - optional dependency
    detect = None

logger = logging.getLogger("sarvam_tts")

SARVAM_BASE_URL = "https://api.sarvam.ai"

SUPPORTED_LANGUAGE_CODES = {
    "en": "en-IN",
    "hi": "hi-IN",
    "bn": "bn-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "mr": "mr-IN",
    "gu": "gu-IN",
    "pa": "pa-IN",
    "or": "or-IN",
}

# Language-specific speaker recommendations (Sarvam may have different speakers available)
LANGUAGE_SPEAKERS = {
    "en-IN": "meera",
    "hi-IN": "shubh",
    "ta-IN": "ananya",
    "te-IN": "arjun",
    "kn-IN": "harish",
    "ml-IN": "arun",
    "mr-IN": "vikram",
    "gu-IN": "rajesh",
    "bn-IN": "arnab",
    "pa-IN": "gurpreet",
    "or-IN": "bijaya",
}


def detect_language_code(text: str) -> str:
    if detect is None:
        return "en-IN"
    try:
        lang = detect(text)
        return SUPPORTED_LANGUAGE_CODES.get(lang, "en-IN")
    except Exception:
        return "en-IN"


async def synthesize_speech(
    text: str,
    target_language_code: Optional[str] = None,
    speaker: str = "shubh",
    model: str = "bulbul:v3",
    pace: float = 1.0,
    temperature: float = 0.6,
    output_audio_codec: str = "mp3",
) -> dict:
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        return {"error": "SARVAM_API_KEY not set"}

    resolved_language = target_language_code or detect_language_code(text)

    payload = {
        "text": text,
        "target_language_code": resolved_language,
        "speaker": speaker,
        "model": model,
        "pace": pace,
        "temperature": temperature,
        "output_audio_codec": output_audio_codec,
    }

    headers = {
        "api-subscription-key": api_key,
        "Content-Type": "application/json",
    }

    url = f"{SARVAM_BASE_URL}/text-to-speech"
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers=headers)

    if response.status_code >= 400:
        return {
            "error": response.text,
            "status_code": response.status_code,
            "language_code": resolved_language,
        }

    data = response.json()
    audio_list = data.get("audios") or []
    audio_base64 = audio_list[0] if audio_list else ""

    return {
        "request_id": data.get("request_id"),
        "audio_base64": audio_base64,
        "language_code": resolved_language,
        "codec": output_audio_codec,
    }
