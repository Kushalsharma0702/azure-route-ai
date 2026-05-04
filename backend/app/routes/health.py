"""
app.routes.health — Health check endpoint (public, no auth).
"""
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health():
    return {"status": "ok", "service": "RouteAura AI Backend"}


@router.get("/api/v1/health")
async def health_v1():
    return {"status": "ok", "version": "1.0", "service": "RouteAura AI Backend"}
