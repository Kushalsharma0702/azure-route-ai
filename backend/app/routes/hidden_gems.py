from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import HiddenGemsEngine

router = APIRouter()

class GemsRequest(BaseModel):
    user_id: int = None
    location: dict = None
    location_name: str = None
    radius_km: int = 10
    source: str = "local"

@router.post("/", tags=["hidden_gems"])
async def gems(req: GemsRequest):
    try:
        gems = await HiddenGemsEngine.find_gems(req.dict())
        return gems
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
