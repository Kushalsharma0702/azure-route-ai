"""
app.schemas.activity — User activity tracking schemas.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class TrackActivityRequest(BaseModel):
    action_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Action type: 'search', 'view_place', 'copilot_query', 'payment', etc.",
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Contextual data about the action",
    )


class ActivityItem(BaseModel):
    id: int
    action_type: str
    metadata: Dict[str, Any] = {}
    created_at: str

    model_config = {"from_attributes": True}


class ActivityFeedResponse(BaseModel):
    activities: List[ActivityItem]
    total: int
