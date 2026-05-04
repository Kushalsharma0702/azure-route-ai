"""
app.routes.trip — Trip Copilot AI planner endpoints.

Endpoints:
  POST /api/v1/trip/plan  — Generate full trip plan from query
  POST /api/v1/trip/chat  — Conversational chat interface
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.core.dependencies import get_db
from app.services.trip_planner_service import TripPlannerService

router = APIRouter(prefix="/api/v1/trip", tags=["trip"])


class TripPlanRequest(BaseModel):
    query: str = Field(..., description="Natural language trip query")


class TripChatRequest(BaseModel):
    messages: List[Dict[str, str]] = Field(
        ...,
        description="Chat messages [{role: 'user'|'ai', content: '...'}]"
    )


@router.post("/plan")
async def plan_trip(req: TripPlanRequest, db: AsyncSession = Depends(get_db)):
    """Generate a complete trip plan from a natural language query."""
    if not req.query.strip():
        return {"error": "Please describe your trip", "plan": None}
    result = await TripPlannerService.plan_trip(req.query, db)
    return result


@router.post("/chat")
async def trip_chat(req: TripChatRequest, db: AsyncSession = Depends(get_db)):
    """Conversational chat for trip planning."""
    if not req.messages:
        return {
            "reply": "Hi! Tell me where you want to travel. For example: 'Plan a 3-day Goa trip under ₹15k'",
            "plan": None,
        }
    result = await TripPlannerService.chat(req.messages, db)
    return result
