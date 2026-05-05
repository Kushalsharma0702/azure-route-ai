"""
app.models — SQLAlchemy ORM models package.

Import all models here so Alembic's env.py can discover them
via a single `import app.models` statement.
"""

from app.models.user import User
from app.models.place import Place
from app.models.activity import UserActivity
from app.models.voice_session import VoiceSession
from app.models.travel_cache import TravelCache
from app.models.payment import Payment
from app.models.hotel_room import HotelRoom
from app.models.hotel_booking import HotelBooking
from app.models.hotel_customer import HotelCustomer
from app.models.hotel import Hotel
from app.models.package import Package
from app.models.package_booking import PackageBooking

__all__ = [
    "User",
    "Place",
    "UserActivity",
    "VoiceSession",
    "TravelCache",
    "Payment",
    "HotelRoom",
    "HotelBooking",
    "HotelCustomer",
    "Hotel",
    "Package",
    "PackageBooking",
]
