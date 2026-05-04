"""
app.services.payment_service — Payment business logic.

CRITICAL: Payment status is updated ONLY via:
1. Server-side signature verification (verify endpoint)
2. Razorpay webhook (source of truth)
NEVER from frontend confirmation alone.
"""
import logging
from uuid import UUID
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.integrations.razorpay_client import RazorpayClient
from app.db.repositories.payment_repo import PaymentRepository
from app.models.payment import Payment
from app.core import settings
from app.core.exceptions import PaymentError, NotFoundError

logger = logging.getLogger("payment_service")


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.repo = PaymentRepository(db)
        self.db = db

    async def create_order(self, user_id: str, amount_paise: int, currency: str = "INR", description: Optional[str] = None, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        rzp_order = RazorpayClient.create_order(
            amount_paise=amount_paise, currency=currency,
            receipt=f"user_{user_id}_{amount_paise}",
            notes={"user_id": user_id, "description": description or ""},
        )

        payment = Payment(
            user_id=UUID(user_id), razorpay_order_id=rzp_order["id"],
            amount_paise=amount_paise, currency=currency,
            status="created", metadata_=metadata or {},
        )
        payment = await self.repo.create(payment)
        await self.repo.commit()

        logger.info("Payment order created: order_id=%s user=%s amount=%d", rzp_order["id"], user_id, amount_paise)
        return {"order_id": rzp_order["id"], "amount_paise": amount_paise, "currency": currency, "key_id": settings.RAZORPAY_KEY_ID, "status": "created"}

    async def verify_payment(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> Dict[str, Any]:
        is_valid = RazorpayClient.verify_payment_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
        if not is_valid:
            raise PaymentError("Payment signature verification failed — possible tampering detected")

        payment = await self.repo.update_payment_status(
            order_id=razorpay_order_id, status="captured",
            payment_id=razorpay_payment_id, signature=razorpay_signature,
        )
        if not payment:
            raise NotFoundError("Payment", razorpay_order_id)
        await self.repo.commit()

        logger.info("Payment verified: order=%s payment=%s", razorpay_order_id, razorpay_payment_id)
        return {"status": "captured", "payment_id": str(payment.id), "message": "Payment verified successfully"}

    async def handle_webhook(self, event: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process Razorpay webhook event. This is the source of truth."""
        logger.info("Webhook received: event=%s", event)

        if event == "payment.captured":
            entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = entity.get("order_id")
            payment_id = entity.get("id")
            if order_id:
                await self.repo.update_payment_status(order_id=order_id, status="captured", payment_id=payment_id)
                await self.repo.commit()
                logger.info("Webhook: Payment captured order=%s", order_id)
        elif event == "payment.failed":
            entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = entity.get("order_id")
            if order_id:
                await self.repo.update_payment_status(order_id=order_id, status="failed")
                await self.repo.commit()
                logger.info("Webhook: Payment failed order=%s", order_id)

        return {"status": "processed"}

    async def get_history(self, user_id: str, skip: int = 0, limit: int = 20) -> Dict[str, Any]:
        payments = await self.repo.get_user_payments(UUID(user_id), skip=skip, limit=limit)
        total = await self.repo.count({"user_id": UUID(user_id)})
        items = [{"id": str(p.id), "amount_paise": p.amount_paise, "currency": p.currency, "status": p.status, "razorpay_order_id": p.razorpay_order_id, "created_at": p.created_at.isoformat()} for p in payments]
        return {"payments": items, "total": total}
