"""
app.models.user — User ORM model.

UUID primary key for globally unique identifiers (important for
distributed systems and avoiding ID enumeration attacks).
JSONB preferences column stores flexible user configuration without
requiring schema migrations for every new preference field.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="user",
        server_default="user",
    )
    preferences: Mapped[dict] = mapped_column(JSONB, default=dict, server_default="{}")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    name: Mapped[str] = mapped_column(String(200), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ─────────────────────────────────────────
    activities = relationship("UserActivity", back_populates="user", lazy="selectin")
    voice_sessions = relationship("VoiceSession", back_populates="user", lazy="selectin")
    payments = relationship("Payment", back_populates="user", lazy="selectin")

    # ── Indexes ───────────────────────────────────────────────
    __table_args__ = (
        Index("idx_users_role_active", "role", postgresql_where=(is_active == True)),
    )

    def __repr__(self) -> str:
        return f"<User {self.email} role={self.role}>"
