"""
app.models.place — Place ORM model.

Stores points of interest with geo coordinates and flexible metadata.
Uses composite index on (latitude, longitude) for proximity queries.
Trigram index on name enables fuzzy search (requires pg_trgm extension).
"""

from datetime import datetime, timezone

from sqlalchemy import (
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Index,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Place(Base):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    metadata_: Mapped[dict] = mapped_column(
        "metadata",  # Column name in DB
        JSONB,
        default=dict,
        server_default="{}",
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("idx_places_geo", "latitude", "longitude"),
        Index("idx_places_category_active", "category", postgresql_where=(is_active == True)),
    )

    def __repr__(self) -> str:
        return f"<Place {self.name} ({self.latitude}, {self.longitude})>"
