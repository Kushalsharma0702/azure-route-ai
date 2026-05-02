from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.copilot_service import generate_copilot
from app.db.database import get_db

router = APIRouter()

class CopilotRequest(BaseModel):
    user_id: int = None
    preferences: dict = {}
    time: str = None
    weather: dict = None
    location: dict = None

@router.post("/", tags=["copilot"])
async def copilot(req: CopilotRequest):
    try:
        suggestion = await generate_copilot(req.dict())
        return suggestion
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
