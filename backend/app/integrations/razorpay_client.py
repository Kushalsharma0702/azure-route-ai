"""
app.integrations.razorpay_client — Razorpay payment gateway integration.

CRITICAL SECURITY RULES:
1. NEVER trust frontend payment confirmations — always verify server-side
2. Webhook handler is the source of truth for payment status
3. Verify HMAC-SHA256 signatures on ALL webhooks
4. Use idempotent operations (same webhook = same result)

Flow:
1. Backend creates Razorpay order → returns order_id to frontend
2. Frontend completes checkout with Razorpay SDK
3. Frontend sends (order_id, payment_id, signature) to verify endpoint
4. Backend verifies signature using HMAC-SHA256
5. Razorpay webhook also fires → backend updates payment status
6. Payment is confirmed ONLY after signature verification
"""

import hmac
import hashlib
import logging
from typing import Optional, Dict, Any

import razorpay

from app.core import settings
from app.core.exceptions import PaymentError, ExternalServiceError

logger = logging.getLogger("razorpay_client")


class RazorpayClient:
    """
    Razorpay payment gateway client.

    Wraps the official razorpay Python SDK with error handling
    and signature verification.
    """

    _client: Optional[razorpay.Client] = None

    @classmethod
    def _get_client(cls) -> razorpay.Client:
        """Lazy-initialize the Razorpay client."""
        if cls._client is None:
            if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
                raise PaymentError("Razorpay credentials not configured")
            cls._client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        return cls._client

    @classmethod
    def create_order(
        cls,
        amount_paise: int,
        currency: str = "INR",
        receipt: Optional[str] = None,
        notes: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a Razorpay order.

        Args:
            amount_paise: Amount in paise (₹500 = 50000)
            currency: ISO 4217 currency code
            receipt: Optional receipt ID for your records
            notes: Optional key-value pairs (shown in Razorpay dashboard)

        Returns:
            Razorpay order object with 'id', 'amount', 'currency', 'status'
        """
        client = cls._get_client()

        payload = {
            "amount": amount_paise,
            "currency": currency,
            "payment_capture": 1,  # Auto-capture (no manual capture needed)
        }
        if receipt:
            payload["receipt"] = receipt
        if notes:
            payload["notes"] = notes

        try:
            order = client.order.create(data=payload)
            logger.info(
                "Razorpay order created: id=%s amount=%d currency=%s",
                order.get("id"), amount_paise, currency,
            )
            return order
        except Exception as e:
            logger.exception("Razorpay order creation failed")
            raise ExternalServiceError("Razorpay", f"Order creation failed: {str(e)}")

    @classmethod
    def verify_payment_signature(
        cls,
        order_id: str,
        payment_id: str,
        signature: str,
    ) -> bool:
        """
        Verify payment signature using HMAC-SHA256.

        Razorpay signs: "{order_id}|{payment_id}" with your key_secret.
        We recompute the HMAC and compare with the provided signature.

        This is the ONLY reliable way to confirm a payment is genuine.
        """
        try:
            message = f"{order_id}|{payment_id}"
            expected_signature = hmac.new(
                key=settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
                msg=message.encode("utf-8"),
                digestmod=hashlib.sha256,
            ).hexdigest()

            is_valid = hmac.compare_digest(expected_signature, signature)

            if not is_valid:
                logger.warning(
                    "Payment signature verification FAILED: order=%s payment=%s",
                    order_id, payment_id,
                )
            else:
                logger.info(
                    "Payment signature verified: order=%s payment=%s",
                    order_id, payment_id,
                )

            return is_valid

        except Exception as e:
            logger.exception("Signature verification error")
            return False

    @classmethod
    def verify_webhook_signature(
        cls,
        body: bytes,
        signature: str,
    ) -> bool:
        """
        Verify Razorpay webhook signature.

        Razorpay signs the raw request body with your webhook_secret.
        This prevents attackers from sending fake webhook events.
        """
        if not settings.RAZORPAY_WEBHOOK_SECRET:
            logger.error("RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook")
            return False

        try:
            expected = hmac.new(
                key=settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
                msg=body,
                digestmod=hashlib.sha256,
            ).hexdigest()

            is_valid = hmac.compare_digest(expected, signature)

            if not is_valid:
                logger.warning("Webhook signature verification FAILED")

            return is_valid

        except Exception as e:
            logger.exception("Webhook signature verification error")
            return False

    @classmethod
    def fetch_payment(cls, payment_id: str) -> Dict[str, Any]:
        """Fetch payment details from Razorpay (for reconciliation)."""
        client = cls._get_client()
        try:
            return client.payment.fetch(payment_id)
        except Exception as e:
            logger.exception("Failed to fetch payment %s", payment_id)
            raise ExternalServiceError("Razorpay", f"Payment fetch failed: {str(e)}")
