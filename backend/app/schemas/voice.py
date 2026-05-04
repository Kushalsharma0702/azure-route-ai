"""
app.schemas.voice — Voice interaction schemas.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1, max_length=5000)


class VoiceChatRequest(BaseModel):
    """Multi-turn voice conversation request."""
    messages: List[ChatMessage] = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Conversation history (last 20 turns max)",
    )
    language: Optional[str] = Field(
        default=None,
        description="Target language code (e.g. 'hi-IN', 'en-IN', 'auto')",
    )


class VoiceChatResponse(BaseModel):
    reply: str
    mode: str
    language: Optional[str] = None
    session_id: Optional[str] = None
    tts_suggestion: Optional[Dict[str, Any]] = None


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    target_language_code: Optional[str] = None
    speaker: str = "meera"
    pace: float = Field(default=1.0, ge=0.5, le=2.0)
    temperature: float = Field(default=0.6, ge=0.0, le=1.0)
    output_audio_codec: str = "mp3"


class TTSResponse(BaseModel):
    request_id: Optional[str] = None
    audio_base64: str
    language_code: str
    codec: str


class STTResponse(BaseModel):
    text: str
    raw: Optional[Dict[str, Any]] = None


class VoiceSessionResponse(BaseModel):
    id: str
    transcript: Optional[str] = None
    response: Optional[str] = None
    language: Optional[str] = None
    duration_ms: Optional[int] = None
    created_at: str

    model_config = {"from_attributes": True}
