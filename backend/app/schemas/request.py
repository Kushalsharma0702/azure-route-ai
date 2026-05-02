from pydantic import BaseModel
from typing import Optional, Dict

class CopilotRequest(BaseModel):
    user_id: Optional[int] = None
    preferences: Optional[Dict] = None
    time: Optional[str] = None
    weather: Optional[Dict] = None
    location: Optional[Dict] = None

class LiveStatusRequest(BaseModel):
    place_id: int

class VoiceRequest(BaseModel):
    user_id: Optional[int] = None
    text: str

class GemsRequest(BaseModel):
    user_id: Optional[int] = None
    location: Optional[Dict] = None
    radius_km: int = 10
