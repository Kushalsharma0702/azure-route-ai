"""
app.db.repositories.payment_repo — Payment repository.

Specialized queries for payment lifecycle management.
"""

from typing import Optional, List
from uuid import UUID

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.payment import Payment


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Payment, session)

    async def get_by_razorpay_order_id(self, order_id: str) -> Optional[Payment]:
        """Lookup payment by Razorpay order ID (used by webhooks)."""
        stmt = select(Payment).where(Payment.razorpay_order_id == order_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_payments(
        self,
        user_id: UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Payment]:
        """Get a user's payment history, optionally filtered by status."""
        stmt = (
            select(Payment)
            .where(Payment.user_id == user_id)
            .order_by(Payment.created_at.desc())
        )
        if status:
            stmt = stmt.where(Payment.status == status)
        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update_payment_status(
        self,
        order_id: str,
        status: str,
        payment_id: Optional[str] = None,
        signature: Optional[str] = None,
    ) -> Optional[Payment]:
        """
        Update payment status after Razorpay webhook/verification.
        This is the ONLY way payment status should transition.
        """
        payment = await self.get_by_razorpay_order_id(order_id)
        if not payment:
            return None

        values = {"status": status}
        if payment_id:
            values["razorpay_payment_id"] = payment_id
        if signature:
            values["razorpay_signature"] = signature

        return await self.update_by_id(payment.id, values)
