"""
app.schemas.hidden_gems — Hidden gems discovery schemas.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class HiddenGemsRequest(BaseModel):
    location: Optional[Dict[str, float]] = Field(
        default=None,
        description="User location {lat, lng}",
    )
    location_name: Optional[str] = Field(
        default=None,
        description="Name of the location for text-based discovery",
    )
    radius_km: int = Field(default=10, ge=1, le=100)
    source: str = Field(
        default="local",
        pattern="^(local|reddit|ai)$",
        description="Data source: 'local' (DB), 'reddit' (Reddit API), 'ai' (LLM)",
    )
    categories: Optional[List[str]] = Field(
        default=None,
        description="Filter by categories (cafe, park, temple, etc.)",
    )


class HiddenGem(BaseModel):
    id: str
    name: str
    category: str
    location: Dict[str, float]
    reason: str
    source: Optional[str] = None


class HiddenGemsResponse(BaseModel):
    gems: List[HiddenGem]
    source: str
    total: int = 0
