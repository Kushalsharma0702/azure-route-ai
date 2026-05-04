"""
app.schemas.travel — Travel status request/response schemas.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class TrainStatusRequest(BaseModel):
    train_number: Optional[str] = None
    source: Optional[str] = None
    destination: Optional[str] = None
    date: Optional[str] = Field(
        default=None,
        description="Travel date in YYYY-MM-DD format",
    )


class FlightStatusRequest(BaseModel):
    flight_number: Optional[str] = None
    source: Optional[str] = None  # IATA airport code
    destination: Optional[str] = None
    date: Optional[str] = None


class TravelSearchRequest(BaseModel):
    transport_type: str = Field(..., pattern="^(train|flight)$")
    source: str
    destination: str
    date: Optional[str] = None


class TravelResult(BaseModel):
    transport_type: str
    source: str
    destination: str
    data: Dict[str, Any]
    cached: bool = False
    fetched_at: Optional[str] = None


class TravelSearchResponse(BaseModel):
    results: List[TravelResult]
    source: str  # "cache" or "live"
    total: int
