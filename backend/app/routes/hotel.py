"""
app.routes.hotel — Hotel management CRUD endpoints.

Used by Hotel-CRM (full CRUD) and Client-CRM (read-only).
When Hotel-CRM updates a room → Client-CRM sees the change instantly
because they share the same database.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update

from app.core.dependencies import get_db, optional_current_user
from app.core.security import TokenPayload
from app.models.hotel_room import HotelRoom
from app.models.hotel_booking import HotelBooking
from app.models.hotel_customer import HotelCustomer
from app.models.hotel import Hotel

router = APIRouter(prefix="/api/v1/hotel", tags=["hotel"])


# ── Schemas ───────────────────────────────────────────────

class RoomCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(default="Standard")
    price: float = Field(..., gt=0)
    available: bool = True
    amenities: List[str] = []
    image_url: Optional[str] = None
    description: Optional[str] = None
    capacity: int = 2
    hotel_id: Optional[int] = None  # if omitted, auto-assigned to default hotel
    beds: Optional[str] = "1 King Bed"
    size: Optional[str] = "30 sqm"


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    price: Optional[float] = None
    available: Optional[bool] = None
    amenities: Optional[List[str]] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None


class BookingCreate(BaseModel):
    guest_name: str
    guest_email: Optional[str] = None
    room_id: Optional[int] = None
    room_name: str
    check_in: str
    check_out: str
    status: str = "Pending"
    payment_status: str = "Pending"
    amount: float = 0


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    amount: Optional[float] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None


class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None


# ── ROOMS CRUD ────────────────────────────────────────────

@router.get("/rooms")
async def list_rooms(
    available_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
):
    """List all rooms — used by both Hotel-CRM and Client-CRM."""
    stmt = select(HotelRoom).order_by(HotelRoom.id)
    if available_only:
        stmt = stmt.where(HotelRoom.available == True)
    result = await db.execute(stmt)
    rooms = result.scalars().all()
    return {"rooms": [r.to_dict() for r in rooms], "total": len(rooms)}


@router.get("/rooms/{room_id}")
async def get_room(room_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HotelRoom).where(HotelRoom.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room.to_dict()


@router.post("/rooms", status_code=201)
async def create_room(
    req: RoomCreate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a room and auto-assigns it to a hotel.
    If hotel_id is not provided, uses or creates the default hotel (ID 1).
    This ensures Client-CRM can always find the room via GET /api/v1/hotels/{id}.
    """
    data = req.model_dump()

    # Resolve hotel_id — always link rooms to a hotel so Client-CRM can fetch them
    hotel_id = data.pop("hotel_id", None)
    if not hotel_id:
        # Use or create the default hotel
        result = await db.execute(select(Hotel).order_by(Hotel.id).limit(1))
        default_hotel = result.scalar_one_or_none()
        if not default_hotel:
            default_hotel = Hotel(
                name="RouteAura Hotel",
                location="India",
                city="Default",
                description="Default hotel property",
                price=0,
            )
            db.add(default_hotel)
            await db.flush()
        hotel_id = default_hotel.id

    room = HotelRoom(**data, hotel_id=hotel_id)
    db.add(room)
    await db.commit()
    await db.refresh(room)
    return room.to_dict()


@router.put("/rooms/{room_id}")
async def update_room(
    room_id: int,
    req: RoomUpdate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(HotelRoom).where(HotelRoom.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(room, key, value)
    await db.commit()
    await db.refresh(room)
    return room.to_dict()


@router.delete("/rooms/{room_id}")
async def delete_room(
    room_id: int,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(HotelRoom).where(HotelRoom.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    await db.delete(room)
    await db.commit()
    return {"deleted": True, "id": room_id}


@router.put("/rooms/{room_id}/toggle-availability")
async def toggle_room_availability(
    room_id: int,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(HotelRoom).where(HotelRoom.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room.available = not room.available
    await db.commit()
    return room.to_dict()


# ── BOOKINGS CRUD ─────────────────────────────────────────

@router.get("/bookings")
async def list_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(HotelBooking).order_by(HotelBooking.created_at.desc()).offset(skip).limit(limit)
    )
    bookings = result.scalars().all()
    count_result = await db.execute(select(func.count()).select_from(HotelBooking))
    total = count_result.scalar()
    return {"bookings": [b.to_dict() for b in bookings], "total": total}


@router.post("/bookings", status_code=201)
async def create_booking(
    req: BookingCreate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    booking = HotelBooking(**req.model_dump())
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking.to_dict()


@router.put("/bookings/{booking_id}")
async def update_booking(
    booking_id: str,
    req: BookingUpdate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(HotelBooking).where(HotelBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(booking, key, value)
    await db.commit()
    await db.refresh(booking)
    return booking.to_dict()


@router.delete("/bookings/{booking_id}")
async def delete_booking(
    booking_id: str,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(HotelBooking).where(HotelBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    await db.delete(booking)
    await db.commit()
    return {"deleted": True, "id": booking_id}


# ── CUSTOMERS CRUD ────────────────────────────────────────

@router.get("/customers")
async def list_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HotelCustomer).order_by(HotelCustomer.id))
    customers = result.scalars().all()
    return {"customers": [c.to_dict() for c in customers], "total": len(customers)}


@router.post("/customers", status_code=201)
async def create_customer(
    req: CustomerCreate,
    current_user: TokenPayload | None = Depends(optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    customer = HotelCustomer(**req.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer.to_dict()


# ── DASHBOARD STATS ───────────────────────────────────────

@router.get("/stats")
async def dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Aggregate stats for Hotel-CRM dashboard."""
    rooms_result = await db.execute(select(func.count()).select_from(HotelRoom))
    total_rooms = rooms_result.scalar() or 0

    avail_result = await db.execute(
        select(func.count()).select_from(HotelRoom).where(HotelRoom.available == True)
    )
    available_rooms = avail_result.scalar() or 0

    bookings_result = await db.execute(select(func.count()).select_from(HotelBooking))
    total_bookings = bookings_result.scalar() or 0

    revenue_result = await db.execute(
        select(func.coalesce(func.sum(HotelBooking.amount), 0)).where(
            HotelBooking.payment_status == "Paid"
        )
    )
    total_revenue = revenue_result.scalar() or 0

    occupancy = round((1 - available_rooms / max(total_rooms, 1)) * 100, 1)

    return {
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "occupancy_rate": occupancy,
        "available_rooms": available_rooms,
        "total_rooms": total_rooms,
    }
