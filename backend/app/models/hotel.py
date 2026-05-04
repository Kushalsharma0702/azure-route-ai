"""
app.models.hotel — Hotel property model.

One hotel → many rooms (hotel_rooms.hotel_id FK).
This was missing, causing HotelResults/HotelDetail in Client-CRM
to fall back to static @/data/hotels instead of the database.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base import Base


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    city = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    rating = Column(Float, default=4.0)
    reviews = Column(Integer, default=0)
    price = Column(Float, nullable=False, default=0)      # starting price (min room price)
    original_price = Column(Float, nullable=True)
    amenities = Column(ARRAY(String), default=list)
    badges = Column(ARRAY(String), default=list)
    check_in_time = Column(String(20), default="2:00 PM")
    check_out_time = Column(String(20), default="12:00 PM")
    cancellation_policy = Column(String(200), default="Free cancellation up to 24 hours before check-in")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # One hotel → many rooms
    rooms = relationship("HotelRoom", back_populates="hotel", lazy="selectin", cascade="all, delete-orphan")

    def to_dict(self, include_rooms: bool = False) -> dict:
        d = {
            "id": str(self.id),
            "name": self.name,
            "location": self.location,
            "city": self.city,
            "description": self.description,
            "image": self.image_url or "",
            "images": [self.image_url] if self.image_url else [],
            "rating": self.rating,
            "reviews": self.reviews,
            "price": self.price,
            "originalPrice": self.original_price,
            "amenities": self.amenities or [],
            "badges": self.badges or [],
            "policies": {
                "checkIn": self.check_in_time,
                "checkOut": self.check_out_time,
                "cancellation": self.cancellation_policy,
            },
            "guestReviews": [],
        }
        if include_rooms:
            d["rooms"] = [r.to_client_dict() for r in (self.rooms or [])]
        return d
