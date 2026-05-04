"""
app.models.travel_cache — TravelCache ORM model.

Database-backed cache for train and flight data. Supplements Redis
caching — this provides persistence across Redis restarts and a
queryable audit trail of fetched travel data.

The UNIQUE constraint on (transport_type, source, destination) ensures
upsert semantics: we update existing rows rather than creating duplicates.
"""

from datetime import datetime, timezone, timedelta

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    Index,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _default_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=15)


class TravelCache(Base):
    __tablename__ = "travel_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transport_type: Mapped[str] = mapped_column(String(20), nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_default_expiry,
    )

    __table_args__ = (
        UniqueConstraint("transport_type", "source", "destination", name="uq_travel_cache_route"),
        CheckConstraint(
            "transport_type IN ('train', 'flight')",
            name="ck_travel_cache_type",
        ),
        Index("idx_travel_cache_expires", "expires_at"),
    )

    @property
    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at

    def __repr__(self) -> str:
        return f"<TravelCache {self.transport_type} {self.source}→{self.destination}>"
