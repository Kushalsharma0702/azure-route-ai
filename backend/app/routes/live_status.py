from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.ai_engine import LiveStatusEngine

router = APIRouter()

@router.get("/", tags=["live_status"])
async def get_live_status(place_id: int = Query(...), refresh: Optional[bool] = False):
    try:
        data = await LiveStatusEngine.get_status(place_id, force_refresh=refresh)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
