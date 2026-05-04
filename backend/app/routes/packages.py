"""
app.routes.packages — Package booking CRUD.

Used by:
  - Client-CRM: POST to create bookings when user pays
  - Hotel-CRM:  GET/PUT/DELETE to manage bookings + edit itineraries
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List, Any

from app.core.dependencies import get_db
from app.models.package_booking import PackageBooking

router = APIRouter(prefix="/api/v1/packages", tags=["packages"])


# ── Schemas ───────────────────────────────────────────────

class PackageBookingCreate(BaseModel):
    package_title: str
    package_destination: str
    package_duration: str
    package_category: Optional[str] = None
    guest_name: str
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    travelers_count: int = 1
    travelers: Optional[List[Any]] = None
    itinerary: Optional[List[Any]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    add_ons: Optional[List[Any]] = None
    travel_date: Optional[str] = None
    status: str = "Confirmed"
    payment_status: str = "Pending"
    amount: float = 0


class PackageBookingUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    amount: Optional[float] = None
    itinerary: Optional[List[Any]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    add_ons: Optional[List[Any]] = None
    travel_date: Optional[str] = None
    staff_notes: Optional[str] = None
    assigned_to: Optional[str] = None
    package_title: Optional[str] = None
    package_destination: Optional[str] = None
    package_duration: Optional[str] = None
    package_category: Optional[str] = None


# ── CRUD ──────────────────────────────────────────────────

@router.get("/bookings")
async def list_package_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List all package bookings — Hotel-CRM dashboard."""
    stmt = select(PackageBooking).order_by(PackageBooking.created_at.desc())
    if status:
        stmt = stmt.where(PackageBooking.status == status)
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    # Stats
    total_stmt = select(func.count(PackageBooking.id))
    total_result = await db.execute(total_stmt)
    total = total_result.scalar() or 0

    revenue_stmt = select(func.coalesce(func.sum(PackageBooking.amount), 0))
    revenue_result = await db.execute(revenue_stmt)
    total_revenue = revenue_result.scalar() or 0

    return {
        "bookings": [b.to_dict() for b in bookings],
        "total": total,
        "total_revenue": total_revenue,
    }


@router.get("/bookings/{booking_id}")
async def get_package_booking(booking_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PackageBooking).where(PackageBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Package booking not found")
    return booking.to_dict()


@router.post("/bookings", status_code=201)
async def create_package_booking(data: PackageBookingCreate, db: AsyncSession = Depends(get_db)):
    """Create a new package booking — called by Client-CRM when user pays."""
    booking = PackageBooking(
        package_title=data.package_title,
        package_destination=data.package_destination,
        package_duration=data.package_duration,
        package_category=data.package_category,
        guest_name=data.guest_name,
        guest_email=data.guest_email,
        guest_phone=data.guest_phone,
        travelers_count=data.travelers_count,
        travelers=data.travelers,
        itinerary=data.itinerary,
        inclusions=data.inclusions or [],
        exclusions=data.exclusions or [],
        add_ons=data.add_ons,
        travel_date=data.travel_date,
        status=data.status,
        payment_status=data.payment_status,
        amount=data.amount,
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking.to_dict()


@router.put("/bookings/{booking_id}")
async def update_package_booking(
    booking_id: str, data: PackageBookingUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a package booking — used by Hotel-CRM staff to edit itinerary, status, etc."""
    result = await db.execute(select(PackageBooking).where(PackageBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Package booking not found")

    update_data = data.model_dump(exclude_unset=True)
    
    # Track if we need to send an email
    should_notify = False
    old_status = booking.status
    
    for key, val in update_data.items():
        setattr(booking, key, val)
        
    if update_data.get("status") and update_data.get("status") != old_status:
        should_notify = True
    if update_data.get("staff_notes"):
        should_notify = True

    await db.commit()
    await db.refresh(booking)
    
    if should_notify and booking.guest_email:
        try:
            from app.services.mail_service import mail_service
            import asyncio
            # Run email sending in background to avoid blocking API response
            asyncio.create_task(
                asyncio.to_thread(
                    mail_service.send_booking_update_email,
                    to_email=booking.guest_email,
                    guest_name=booking.guest_name,
                    package_title=booking.package_title,
                    status=booking.status,
                    notes=booking.staff_notes or ""
                )
            )
        except Exception as e:
            import logging
            logging.getLogger("packages_route").error("Failed to trigger email: %s", e)
            
    return booking.to_dict()


@router.delete("/bookings/{booking_id}")
async def delete_package_booking(booking_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PackageBooking).where(PackageBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Package booking not found")
    await db.delete(booking)
    await db.commit()
    return {"detail": "Package booking deleted", "id": booking_id}


@router.get("/stats")
async def package_stats(db: AsyncSession = Depends(get_db)):
    """Stats for Hotel-CRM packages dashboard card."""
    total = (await db.execute(select(func.count(PackageBooking.id)))).scalar() or 0
    revenue = (await db.execute(
        select(func.coalesce(func.sum(PackageBooking.amount), 0))
    )).scalar() or 0
    confirmed = (await db.execute(
        select(func.count(PackageBooking.id)).where(PackageBooking.status == "Confirmed")
    )).scalar() or 0
    pending = (await db.execute(
        select(func.count(PackageBooking.id)).where(PackageBooking.status == "Pending")
    )).scalar() or 0

    return {
        "total_bookings": total,
        "total_revenue": revenue,
        "confirmed": confirmed,
        "pending": pending,
    }
