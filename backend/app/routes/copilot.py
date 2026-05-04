"""
app.routes.copilot — AI copilot endpoints.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.schemas.copilot import CopilotRequest, CopilotResponse, ItineraryRequest, ItineraryResponse
from app.services.copilot_service import CopilotService

router = APIRouter(prefix="/api/v1/copilot", tags=["copilot"])


@router.post("/suggest", response_model=CopilotResponse)
async def suggest(
    req: CopilotRequest,
    current_user: TokenPayload = Depends(get_current_user),
):
    return await CopilotService.get_suggestion(req.model_dump())


@router.post("/itinerary", response_model=ItineraryResponse)
async def itinerary(
    req: ItineraryRequest,
    current_user: TokenPayload = Depends(get_current_user),
):
    return await CopilotService.generate_itinerary(
        req.destination, req.days, req.preferences, req.budget,
    )
