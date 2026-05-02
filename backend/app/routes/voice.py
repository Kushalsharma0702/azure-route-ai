from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.services.voice_engine import VoiceEngine
from app.services.sarvam_tts import synthesize_speech
from app.services.ai_engine import LLMAdapter
import os
from typing import List

router = APIRouter()

class VoiceRequest(BaseModel):
    user_id: int = None
    text: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str = None  # e.g., 'hi-IN', 'en-IN', or 'auto'


class TTSRequest(BaseModel):
    text: str
    target_language_code: str = None
    speaker: str = "shubh"
    pace: float = 1.0
    temperature: float = 0.6
    output_audio_codec: str = "mp3"

@router.post("/", tags=["voice"])
async def voice(req: VoiceRequest):
    try:
        out = VoiceEngine.handle_text(req.text, req.user_id)
        return out
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", tags=["voice"])
async def voice_chat(req: ChatRequest):
    try:
        use_llm = os.getenv("USE_LLM", "false").lower() in ("1", "true", "yes")
        if not use_llm:
            return {
                "reply": "I can help you plan a trip. Tell me your destination, dates, and budget.",
                "mode": "rule-based",
                "language": req.language,
            }
        
        # Build language instruction for the LLM
        language_instruction = ""
        if req.language and req.language != "auto":
            language_map = {
                "en-IN": "English",
                "hi-IN": "Hindi",
                "bn-IN": "Bengali",
                "ta-IN": "Tamil",
                "te-IN": "Telugu",
                "kn-IN": "Kannada",
                "ml-IN": "Malayalam",
                "mr-IN": "Marathi",
                "gu-IN": "Gujarati",
                "pa-IN": "Punjabi",
                "or-IN": "Odia",
            }
            lang_name = language_map.get(req.language, req.language)
            language_instruction = f"\n\nIMPORTANT: Respond ONLY in {lang_name}. Do not translate or use English."
        
        # Add a richer system prompt to encourage polite, human-like phrasing
        prompt_lines = [
            "You are a friendly, native-sounding travel assistant.",
            "Respond as a helpful, warm, and polite native speaker.",
            "Use natural conversational rhythm, short sentences, occasional contractions, and empathetic interjections where appropriate.",
            "Keep responses concise but human — polite, upbeat, and easy to read aloud by a TTS engine.",
        ]
        for msg in req.messages[-8:]:
            prompt_lines.append(f"{msg.role}: {msg.content}")

        # Append language instruction and TTS note
        prompt_lines.append(language_instruction)
        prompt_lines.append("When you reply, produce conversational sentences suitable for spoken audio (avoid long nested clauses).\nProvide only the reply text in your output.")

        llm_out = await LLMAdapter.call_llm("\n".join(prompt_lines))
        if "error" in llm_out:
            return {
                "reply": "I ran into a problem generating a response. Please try again.",
                "mode": "error",
                "language": req.language,
            }

        # Include suggested TTS parameters to encourage a natural, polite voice on the client
        tts_suggestion = {
            "speaker": os.getenv("DEFAULT_SARVAM_SPEAKER", "shubh"),
            "pace": 0.98,
            "temperature": 0.7,
            "output_audio_codec": "mp3",
        }

        return {
            "reply": llm_out.get("text", ""),
            "mode": "llm",
            "language": req.language,
            "tts_suggestion": tts_suggestion,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stt", tags=["voice"])
async def voice_stt(file: UploadFile = File(...), language: str = None):
    """
    Accepts an audio file upload (multipart/form-data) and returns transcribed text.

    This will try to use OpenAI's Whisper transcription endpoint when `OPENAI_API_KEY` is set.
    If no provider is configured, it returns a helpful error message.
    """
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=501, detail="No STT provider configured. Set OPENAI_API_KEY to enable Whisper transcriptions or provision a local model.")

        # Read file bytes
        audio_bytes = await file.read()

        # Use httpx to send multipart/form-data to OpenAI audio transcription endpoint
        url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {api_key}"}

        # Prepare multipart payload
        data = {"model": "whisper-1"}
        if language:
            data["language"] = language

        files = {"file": (file.filename or "audio.wav", audio_bytes, file.content_type or "application/octet-stream")}

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(url, headers=headers, data=data, files=files)

        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        resp_json = resp.json()
        return {"text": resp_json.get("text", ""), "raw": resp_json}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts", tags=["voice"])
async def voice_tts(req: TTSRequest):
    try:
        result = await synthesize_speech(
            text=req.text,
            target_language_code=req.target_language_code,
            speaker=req.speaker,
            pace=req.pace,
            temperature=req.temperature,
            output_audio_codec=req.output_audio_codec,
        )
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
