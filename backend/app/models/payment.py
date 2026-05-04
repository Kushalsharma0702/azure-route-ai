"""
app.models.payment — Payment ORM model.

Critical design decisions:
- amount_paise stores amount in smallest currency unit (paise for INR)
  to avoid floating point precision issues.
- razorpay_order_id has a UNIQUE constraint for webhook idempotency.
- Status CHECK constraint enforces valid payment lifecycle states.
- ON DELETE RESTRICT on user_id prevents deleting users with payment history
  (financial records must be preserved for compliance).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),  # Never delete users with payments
        nullable=False,
    )
    razorpay_order_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=True,  # Set after Razorpay order creation
    )
    razorpay_payment_id: Mapped[str] = mapped_column(String(100), nullable=True)
    razorpay_signature: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="created",
        server_default="created",
    )
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="INR")
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
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ─────────────────────────────────────────
    user = relationship("User", back_populates="payments")

    __table_args__ = (
        CheckConstraint(
            "status IN ('created', 'authorized', 'captured', 'failed', 'refunded')",
            name="ck_payments_status",
        ),
        CheckConstraint("amount_paise > 0", name="ck_payments_amount_positive"),
        Index("idx_payments_user", "user_id", created_at.desc()),
        Index("idx_payments_status", "status"),
    )

    @property
    def amount_rupees(self) -> float:
        """Convert paise to rupees for display."""
        return self.amount_paise / 100.0

    def __repr__(self) -> str:
        return f"<Payment {self.id} ₹{self.amount_rupees} status={self.status}>"
