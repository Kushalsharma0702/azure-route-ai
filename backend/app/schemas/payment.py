"""
app.schemas.payment — Payment request/response schemas.

Amount is always in paise (smallest currency unit) to avoid
floating-point issues. The frontend should convert ₹500 → 50000 paise.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class CreateOrderRequest(BaseModel):
    amount_paise: int = Field(
        ...,
        gt=0,
        description="Amount in paise (₹500 = 50000 paise)",
    )
    currency: str = Field(default="INR", pattern="^[A-Z]{3}$")
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = {"json_schema_extra": {"examples": [{
        "amount_paise": 50000,
        "currency": "INR",
        "description": "Premium travel plan",
    }]}}


class CreateOrderResponse(BaseModel):
    order_id: str
    amount_paise: int
    currency: str
    key_id: str  # Razorpay publishable key (safe to expose to frontend)
    status: str


class VerifyPaymentRequest(BaseModel):
    """
    Frontend sends these three values after Razorpay checkout completes.
    We verify the signature server-side before trusting the payment.
    """
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    status: str
    payment_id: str
    message: str


class PaymentHistoryItem(BaseModel):
    id: str
    amount_paise: int
    currency: str
    status: str
    razorpay_order_id: Optional[str] = None
    created_at: str

    model_config = {"from_attributes": True}


class PaymentHistoryResponse(BaseModel):
    payments: List[PaymentHistoryItem]
    total: int
