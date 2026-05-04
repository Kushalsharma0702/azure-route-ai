"""
app.routes.activity — User activity tracking endpoints.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.schemas.activity import TrackActivityRequest, ActivityFeedResponse
from app.services.activity_service import ActivityService

router = APIRouter(prefix="/api/v1/activity", tags=["activity"])


@router.post("/track")
async def track(
    req: TrackActivityRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ActivityService(db)
    return await service.track(current_user.user_id, req.action_type, req.metadata)


@router.get("/feed", response_model=ActivityFeedResponse)
async def feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ActivityService(db)
    return await service.get_feed(current_user.user_id, skip, limit)
