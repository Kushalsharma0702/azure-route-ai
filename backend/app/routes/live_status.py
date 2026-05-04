"""
app.routes.travel — Live travel status endpoints.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.schemas.travel import TravelSearchRequest
from app.services.travel_service import TravelService

router = APIRouter(prefix="/api/v1/travel", tags=["travel"])


@router.get("/train/status")
async def train_status(
    train_number: str = Query(...),
    date: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TravelService(db)
    return await service.get_train_status(train_number, date)


@router.get("/flight/status")
async def flight_status(
    flight_number: str = Query(...),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TravelService(db)
    return await service.get_flight_status(flight_number)


@router.post("/search")
async def search(
    req: TravelSearchRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TravelService(db)
    return await service.search(req.transport_type, req.source, req.destination, req.date)
