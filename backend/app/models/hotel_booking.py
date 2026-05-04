"""
app.models.hotel_booking — Hotel booking model.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
import uuid


class HotelBooking(Base):
    __tablename__ = "hotel_bookings"

    id = Column(String(20), primary_key=True, default=lambda: f"BK-{uuid.uuid4().hex[:6].upper()}")
    guest_name = Column(String(200), nullable=False)
    guest_email = Column(String(200), nullable=True)
    room_id = Column(Integer, ForeignKey("hotel_rooms.id", ondelete="SET NULL"), nullable=True)
    room_name = Column(String(200), nullable=False)
    check_in = Column(String(20), nullable=False)
    check_out = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default="Pending")  # Confirmed, Pending, Cancelled
    payment_status = Column(String(20), nullable=False, default="Pending")  # Paid, Pending, Refunded
    amount = Column(Float, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "guest": self.guest_name,
            "guest_email": self.guest_email,
            "room": self.room_name,
            "room_id": self.room_id,
            "checkIn": self.check_in,
            "checkOut": self.check_out,
            "status": self.status,
            "payment": self.payment_status,
            "amount": self.amount,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
