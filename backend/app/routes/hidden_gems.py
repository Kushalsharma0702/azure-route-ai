"""
app.routes.hidden_gems — Hidden gems discovery endpoints.
"""
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.core.security import TokenPayload
from app.schemas.hidden_gems import HiddenGemsRequest, HiddenGemsResponse
from app.services.hidden_gems_service import HiddenGemsService

router = APIRouter(prefix="/api/v1/hidden-gems", tags=["hidden_gems"])


@router.post("/discover", response_model=HiddenGemsResponse)
async def discover(
    req: HiddenGemsRequest,
    current_user: TokenPayload = Depends(get_current_user),
):
    return await HiddenGemsService.discover(
        location=req.location, location_name=req.location_name,
        radius_km=req.radius_km, source=req.source, categories=req.categories,
    )
