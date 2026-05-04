"""
app.routes.voice — Voice interaction endpoints (chat, STT, TTS).
"""
from fastapi import APIRouter, Depends, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.schemas.voice import VoiceChatRequest, VoiceChatResponse, TTSRequest, TTSResponse
from app.services.voice_service import VoiceService

router = APIRouter(prefix="/api/v1/voice", tags=["voice"])


@router.post("/chat", response_model=VoiceChatResponse)
async def voice_chat(
    req: VoiceChatRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoiceService(db)
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    return await service.chat(messages, req.language, current_user.user_id)


@router.post("/stt", tags=["voice"])
async def voice_stt(
    file: UploadFile = File(...),
    language: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoiceService(db)
    audio_bytes = await file.read()
    return await service.speech_to_text(
        audio_bytes, file.filename or "audio.wav",
        file.content_type or "application/octet-stream", language,
    )


@router.post("/tts", response_model=TTSResponse)
async def voice_tts(
    req: TTSRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoiceService(db)
    return await service.text_to_speech(
        req.text, req.target_language_code, req.speaker,
        req.pace, req.temperature, req.output_audio_codec,
    )


@router.get("/sessions")
async def voice_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = VoiceService(db)
    return await service.get_sessions(current_user.user_id, skip, limit)
