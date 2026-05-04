"""
app.models.hotel_room — Hotel room model.

UPDATED: Added hotel_id FK so rooms belong to a hotel property.
Added to_client_dict() to return shape matching Client-CRM's existing Room interface.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from app.db.base import Base


class HotelRoom(Base):
    __tablename__ = "hotel_rooms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # FK to Hotel — nullable so existing standalone rooms still work
    hotel_id = Column(Integer, ForeignKey("hotels.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False, default="Standard")
    price = Column(Float, nullable=False)
    available = Column(Boolean, default=True, nullable=False)
    amenities = Column(ARRAY(String), default=list, nullable=False)
    image_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    capacity = Column(Integer, default=2)
    beds = Column(String(100), nullable=True, default="1 King Bed")
    size = Column(String(50), nullable=True, default="30 sqm")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Back-ref to Hotel
    hotel = relationship("Hotel", back_populates="rooms")

    def to_dict(self) -> dict:
        """Shape used by Hotel-CRM admin panel."""
        return {
            "id": self.id,
            "hotel_id": self.hotel_id,
            "name": self.name,
            "type": self.type,
            "price": self.price,
            "available": self.available,
            "amenities": self.amenities or [],
            "image_url": self.image_url,
            "description": self.description,
            "capacity": self.capacity,
            "beds": self.beds,
            "size": self.size,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_client_dict(self) -> dict:
        """Shape expected by Client-CRM HotelDetail rooms section.
        Matches the static Room interface in @/data/hotels.ts.
        """
        return {
            "id": str(self.id),
            "name": self.name,
            "price": self.price,
            "capacity": self.capacity,
            "beds": self.beds or "1 King Bed",
            "size": self.size or "30 sqm",
            "amenities": self.amenities or [],
            "available": self.available,
        }
