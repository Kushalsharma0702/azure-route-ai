"""
app.models.hotel_customer — Hotel customer model.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.db.base import Base


class HotelCustomer(Base):
    __tablename__ = "hotel_customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False, unique=True)
    phone = Column(String(20), nullable=True)
    bookings_count = Column(Integer, default=0)
    last_stay = Column(String(50), nullable=True)
    vip = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "bookings": self.bookings_count,
            "lastStay": self.last_stay or "—",
            "vip": self.vip,
        }
