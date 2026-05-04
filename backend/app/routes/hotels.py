"""
app.routes.hotels — Hotel property CRUD endpoints.

GET  /api/v1/hotels            → HotelResults.tsx (Client-CRM)
GET  /api/v1/hotels/{id}       → HotelDetail.tsx (Client-CRM)
POST /api/v1/hotels            → Hotel-CRM admin (create hotel)
PUT  /api/v1/hotels/{id}       → Hotel-CRM admin (update hotel)
POST /api/v1/hotels/{id}/rooms → Hotel-CRM admin (add room to hotel)
DELETE /api/v1/hotels/{id}     → Hotel-CRM admin (delete hotel)

Root cause of the sync failure:
  Client-CRM used `import { hotels } from '@/data/hotels'` (static file).
  This router replaces that. Client-CRM pages are updated to fetch from here.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.dependencies import get_db, optional_current_user
from app.core.security import TokenPayload
from app.models.hotel import Hotel
from app.models.hotel_room import HotelRoom

router = APIRouter(prefix="/api/v1/hotels", tags=["hotels"])


# ── Schemas ───────────────────────────────────────────────

class HotelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    location: str
    city: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    rating: float = Field(default=4.0, ge=0, le=5)
    price: float = Field(default=0, ge=0)
    original_price: Optional[float] = None
    amenities: List[str] = []
    badges: List[str] = []
    check_in_time: str = "2:00 PM"
    check_out_time: str = "12:00 PM"
    cancellation_policy: str = "Free cancellation up to 24 hours before check-in"


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    amenities: Optional[List[str]] = None
    badges: Optional[List[str]] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    cancellation_policy: Optional[str] = None
    is_active: Optional[bool] = None


class RoomForHotel(BaseModel):
    name: str
    type: str = "Standard"
    price: float = Field(..., gt=0)
    available: bool = True
    amenities: List[str] = []
    image_url: Optional[str] = None
    description: Optional[str] = None
    capacity: int = 2
    beds: str = "1 King Bed"
    size: str = "30 sqm"


# ── LIST ─────────────────────────────────────────────────

@router.get("")
async def list_hotels(
    city: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """
    Used by Client-CRM HotelResults.tsx.
    Replaces: import { hotels } from '@/data/hotels'
    """
    stmt = select(Hotel).where(Hotel.is_active == True).offset(skip).limit(limit)
    if city:
        stmt = stmt.where(Hotel.city.ilike(f"%{city}%"))
    if min_price is not None:
        stmt = stmt.where(Hotel.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Hotel.price <= max_price)
    if min_rating is not None:
        stmt = stmt.where(Hotel.rating >= min_rating)
    stmt = stmt.order_by(Hotel.rating.desc())

    result = await db.execute(stmt)
    hotels = result.scalars().all()

    count_result = await db.execute(
        select(func.count()).select_from(Hotel).where(Hotel.is_active == True)
    )
    total = count_result.scalar() or 0

    return {
        "hotels": [h.to_dict(include_rooms=False) for h in hotels],
        "total": total,
    }


# ── GET SINGLE ────────────────────────────────────────────

@router.get("/{hotel_id}")
async def get_hotel(hotel_id: int, db: AsyncSession = Depends(get_db)):
    """
    Used by Client-CRM HotelDetail.tsx.
    Returns hotel with its rooms (replaces hotels.find(h => h.id === id)).
    """
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel.to_dict(include_rooms=True)


# ── CREATE ────────────────────────────────────────────────

@router.post("", status_code=201)
async def create_hotel(
    req: HotelCreate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Used by Hotel-CRM admin when adding a new hotel property."""
    hotel = Hotel(**req.model_dump())
    db.add(hotel)
    await db.commit()
    await db.refresh(hotel)
    return hotel.to_dict(include_rooms=True)


# ── UPDATE ────────────────────────────────────────────────

@router.put("/{hotel_id}")
async def update_hotel(
    hotel_id: int,
    req: HotelUpdate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Used by Hotel-CRM admin to update hotel details."""
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    for key, value in req.model_dump(exclude_unset=True).items():
        setattr(hotel, key, value)

    # Recalculate price from rooms if it wasn't explicitly set
    if "price" not in req.model_dump(exclude_unset=True) and hotel.rooms:
        prices = [r.price for r in hotel.rooms if r.available]
        if prices:
            hotel.price = min(prices)

    await db.commit()
    await db.refresh(hotel)
    return hotel.to_dict(include_rooms=True)


# ── DELETE ────────────────────────────────────────────────

@router.delete("/{hotel_id}")
async def delete_hotel(
    hotel_id: int,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    await db.delete(hotel)
    await db.commit()
    return {"deleted": True, "id": hotel_id}


# ── ADD ROOM TO HOTEL ────────────────────────────────────

@router.post("/{hotel_id}/rooms", status_code=201)
async def add_room_to_hotel(
    hotel_id: int,
    req: RoomForHotel,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    POST /api/v1/hotels/{hotel_id}/rooms
    Used by Hotel-CRM admin — adds a room to a specific hotel.
    Client-CRM HotelDetail sees it immediately via GET /api/v1/hotels/{id}.
    """
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    room = HotelRoom(hotel_id=hotel_id, **req.model_dump())
    db.add(room)

    # Update hotel.price to be the min room price
    await db.flush()
    if hotel.rooms:
        prices = [r.price for r in hotel.rooms if r.available]
        if prices:
            hotel.price = min(prices)

    await db.commit()
    await db.refresh(room)
    return room.to_dict()


# ── LIST HOTEL ROOMS ─────────────────────────────────────

@router.get("/{hotel_id}/rooms")
async def list_hotel_rooms(hotel_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return {
        "rooms": [r.to_dict() for r in (hotel.rooms or [])],
        "total": len(hotel.rooms or []),
    }
