"""
app.schemas.copilot — Copilot AI request/response schemas.
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class CopilotRequest(BaseModel):
    """Request for AI travel recommendations."""
    preferences: Optional[Dict[str, Any]] = Field(
        default=None,
        description="User preferences (travel_style, budget, etc.)",
    )
    time: Optional[str] = Field(
        default=None,
        description="Time of day or date for context-aware suggestions",
    )
    weather: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Current weather data (type, temperature, precip_prob)",
    )
    location: Optional[Dict[str, Any]] = Field(
        default=None,
        description="User's current location {lat, lng}",
    )
    query: Optional[str] = Field(
        default=None,
        description="Free-text travel query from the user",
    )

    model_config = {"json_schema_extra": {"examples": [{
        "preferences": {"travel_style": "adventure", "budget": "medium"},
        "weather": {"type": "sunny", "temperature": 28},
        "location": {"lat": 11.4102, "lng": 76.6950},
        "query": "What should I do in Ooty today?",
    }]}}


class CopilotResponse(BaseModel):
    suggestion: str
    reason: str
    mode: str  # "llm" or "rule-based"
    provider: Optional[str] = None


class ItineraryRequest(BaseModel):
    destination: str
    days: int = Field(ge=1, le=30, default=3)
    preferences: Optional[Dict[str, Any]] = None
    budget: Optional[str] = None  # "budget", "medium", "luxury"


class ItineraryResponse(BaseModel):
    destination: str
    days: int
    itinerary: str  # Markdown-formatted itinerary
    mode: str
