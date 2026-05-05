"""
app.models.package — Package inventory model for Holiday Packages.

Admin adds these packages in Hotel-CRM. Client-CRM displays them.
"""
from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSON
from app.db.base import Base
import uuid


class Package(Base):
    __tablename__ = "packages"

    id = Column(String(20), primary_key=True, default=lambda: f"pkg-{uuid.uuid4().hex[:6].lower()}")
    title = Column(String(300), nullable=False)
    destination = Column(String(300), nullable=False)
    image = Column(Text, nullable=False)
    images = Column(ARRAY(Text), default=list)
    duration = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    originalPrice = Column(Float, nullable=True)
    rating = Column(Float, default=5.0)
    reviews = Column(Integer, default=0)
    inclusions = Column(ARRAY(String), default=list)
    exclusions = Column(ARRAY(String), default=list)
    itinerary = Column(JSON, nullable=True)  # [{day: int, title: str, activities: [str]}]
    badges = Column(ARRAY(String), default=list)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    highlights = Column(ARRAY(String), default=list)
    addOns = Column(JSON, nullable=True)     # [{id: str, name: str, description: str, price: float}]
    policies = Column(JSON, nullable=True)   # {cancellation: str, payment: str}

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "destination": self.destination,
            "image": self.image,
            "images": self.images or [],
            "duration": self.duration,
            "price": self.price,
            "originalPrice": self.originalPrice,
            "rating": self.rating,
            "reviews": self.reviews,
            "inclusions": self.inclusions or [],
            "exclusions": self.exclusions or [],
            "itinerary": self.itinerary or [],
            "badges": self.badges or [],
            "category": self.category,
            "description": self.description,
            "highlights": self.highlights or [],
            "addOns": self.addOns or [],
            "policies": self.policies or {}
        }
