"""
app.models.package_booking — Package booking model.

Stores package bookings made from Client-CRM.
Hotel-CRM staff can view, edit itinerary, update status.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, func
from sqlalchemy.dialects.postgresql import ARRAY, JSON
from app.db.base import Base
import uuid


class PackageBooking(Base):
    __tablename__ = "package_bookings"

    id = Column(String(20), primary_key=True, default=lambda: f"PK-{uuid.uuid4().hex[:6].upper()}")
    
    # Package info
    package_title = Column(String(300), nullable=False)
    package_destination = Column(String(300), nullable=False)
    package_duration = Column(String(20), nullable=False)  # e.g. "5N/6D"
    package_category = Column(String(50), nullable=True)    # Family, Adventure, etc.
    
    # Guest info
    guest_name = Column(String(200), nullable=False)
    guest_email = Column(String(200), nullable=True)
    guest_phone = Column(String(30), nullable=True)
    travelers_count = Column(Integer, default=1)
    travelers = Column(JSON, nullable=True)  # [{name, email, phone, gender, age}]
    
    # Itinerary (editable by Hotel-CRM staff)
    itinerary = Column(JSON, nullable=True)  # [{day, title, activities: []}]
    
    # Inclusions/Exclusions
    inclusions = Column(ARRAY(String), default=list)
    exclusions = Column(ARRAY(String), default=list)
    add_ons = Column(JSON, nullable=True)  # [{name, price}]
    
    # Booking details
    travel_date = Column(String(20), nullable=True)  # Start date
    status = Column(String(30), nullable=False, default="Confirmed")   # Confirmed, Pending, Cancelled, Completed
    payment_status = Column(String(20), nullable=False, default="Pending")  # Paid, Pending, Refunded
    amount = Column(Float, nullable=False, default=0)
    
    # Staff notes
    staff_notes = Column(Text, nullable=True)
    assigned_to = Column(String(200), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "package_title": self.package_title,
            "package_destination": self.package_destination,
            "package_duration": self.package_duration,
            "package_category": self.package_category,
            "guest_name": self.guest_name,
            "guest_email": self.guest_email,
            "guest_phone": self.guest_phone,
            "travelers_count": self.travelers_count,
            "travelers": self.travelers or [],
            "itinerary": self.itinerary or [],
            "inclusions": self.inclusions or [],
            "exclusions": self.exclusions or [],
            "add_ons": self.add_ons or [],
            "travel_date": self.travel_date,
            "status": self.status,
            "payment_status": self.payment_status,
            "amount": self.amount,
            "staff_notes": self.staff_notes,
            "assigned_to": self.assigned_to,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
