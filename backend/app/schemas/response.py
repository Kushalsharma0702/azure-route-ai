from pydantic import BaseModel
from typing import Any, Dict, List

class CopilotResponse(BaseModel):
    suggestion: str
    reason: str
    mode: str

class LiveStatusResponse(BaseModel):
    place_id: int
    crowd: str
    noise: str
    waiting_time: int
    timestamp: str
    source: str

class VoiceResponse(BaseModel):
    intent: str
    action: str
    params: Dict[str, Any]
    response_text: str

class GemsResponse(BaseModel):
    gems: List[Dict[str, Any]]
