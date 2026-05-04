"""
app.routes.payments — Payment endpoints including webhook handler.

SECURITY: The webhook endpoint does NOT require JWT auth — it uses
HMAC-SHA256 signature verification from the raw request body instead.
"""
import json
from fastapi import APIRouter, Depends, Request, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.schemas.payment import CreateOrderRequest, CreateOrderResponse, VerifyPaymentRequest, VerifyPaymentResponse, PaymentHistoryResponse
from app.services.payment_service import PaymentService
from app.integrations.razorpay_client import RazorpayClient

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    req: CreateOrderRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.create_order(
        user_id=current_user.user_id,
        amount_paise=req.amount_paise,
        currency=req.currency,
        description=req.description,
        metadata=req.metadata,
    )


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(
    req: VerifyPaymentRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.verify_payment(
        req.razorpay_order_id, req.razorpay_payment_id, req.razorpay_signature,
    )


@router.post("/webhook")
async def webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Razorpay webhook handler.

    Does NOT use JWT auth — verifies using HMAC-SHA256 signature
    from the X-Razorpay-Signature header instead.
    """
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not RazorpayClient.verify_webhook_signature(body, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = json.loads(body)
    event = payload.get("event", "")

    service = PaymentService(db)
    return await service.handle_webhook(event, payload)


@router.get("/history", response_model=PaymentHistoryResponse)
async def payment_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.get_history(current_user.user_id, skip, limit)
