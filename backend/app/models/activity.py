"""
app.models.activity — UserActivity ORM model.

Tracks every meaningful user action for personalization and analytics.
Uses BIGSERIAL PK because activity tables grow fast in production.
Composite index on (user_id, created_at DESC) optimizes the most
common query pattern: "show me this user's recent activity".
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    BigInteger,
    String,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserActivity(Base):
    __tablename__ = "user_activity"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    metadata_: Mapped[dict] = mapped_column(
        "metadata",
        JSONB,
        default=dict,
        server_default="{}",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ─────────────────────────────────────────
    user = relationship("User", back_populates="activities")

    __table_args__ = (
        Index("idx_user_activity_user_time", "user_id", created_at.desc()),
        Index("idx_user_activity_action", "action_type"),
    )

    def __repr__(self) -> str:
        return f"<UserActivity {self.action_type} user={self.user_id}>"
