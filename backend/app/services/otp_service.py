"""
app.services.otp_service — In-house OTP system using Redis.

No external email API needed. OTP is:
1. Generated as 6-digit code
2. Stored in Redis with 5-min TTL
3. Logged to console (dev) — in production, plug in any SMTP/SendGrid

This is deliberately simple and free — no third-party OTP service required.
"""
import random
import logging
from typing import Optional
from app.cache.redis_client import get_redis

logger = logging.getLogger("otp_service")

OTP_TTL_SECONDS = 300  # 5 minutes
OTP_PREFIX = "otp:email:"
MAX_ATTEMPTS = 5


class OTPService:
    """In-house OTP generation and verification using Redis."""

    @classmethod
    async def generate_otp(cls, email: str) -> str:
        """
        Generate and store a 6-digit OTP for the given email.

        In development: OTP is logged to console.
        In production: Hook up SMTP/SendGrid here.
        """
        otp = str(random.randint(100000, 999999))
        key = f"{OTP_PREFIX}{email.lower().strip()}"

        r = await get_redis()
        if r:
            # Rate limiting: max 3 requests per minute per email
            rate_limit_key = f"rate_limit:otp:{email.lower().strip()}"
            current_requests = await r.get(rate_limit_key)
            if current_requests and int(current_requests) >= 3:
                raise Exception("Rate limit exceeded. Please try again after a minute.")
                
            await r.incr(rate_limit_key)
            if not current_requests:
                await r.expire(rate_limit_key, 60)
                
            # Store OTP with TTL and attempt counter
            await r.setex(key, OTP_TTL_SECONDS, otp)
            await r.setex(f"{key}:attempts", OTP_TTL_SECONDS, "0")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Send OTP via Mailjet
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        try:
            from app.services.mail_service import mail_service
            mail_service.send_otp_email(email, otp)
        except Exception as e:
            logger.error("Error calling mail_service: %s", e)
            
        logger.info("=" * 50)
        logger.info("📧 OTP for %s: %s", email, otp)
        logger.info("=" * 50)
        print(f"\n{'='*50}")
        print(f"📧  OTP for {email}: {otp}")
        print(f"    (Valid for {OTP_TTL_SECONDS // 60} minutes)")
        print(f"{'='*50}\n")

        return otp

    @classmethod
    async def verify_otp(cls, email: str, otp: str) -> bool:
        """
        Verify the OTP for the given email.

        Returns True if valid, False otherwise.
        Auto-deletes OTP after successful verification (one-time use).
        """
        key = f"{OTP_PREFIX}{email.lower().strip()}"
        attempts_key = f"{key}:attempts"

        r = await get_redis()
        if not r:
            logger.warning("Redis unavailable — OTP verification failed")
            return False

        # Check attempt count (brute-force protection)
        attempts = await r.get(attempts_key)
        if attempts and int(attempts) >= MAX_ATTEMPTS:
            logger.warning("OTP max attempts exceeded for %s", email)
            await r.delete(key)
            await r.delete(attempts_key)
            return False

        # Increment attempt counter
        await r.incr(attempts_key)

        # Check OTP
        stored_otp = await r.get(key)
        if stored_otp is None:
            logger.info("OTP expired or not found for %s", email)
            return False

        if stored_otp != otp:
            logger.info("OTP mismatch for %s (attempt %s)", email, attempts)
            return False

        # Valid! Delete OTP (one-time use)
        await r.delete(key)
        await r.delete(attempts_key)
        logger.info("OTP verified successfully for %s", email)
        return True

    @classmethod
    async def has_pending_otp(cls, email: str) -> bool:
        """Check if there's a pending OTP for this email."""
        r = await get_redis()
        if not r:
            return False
        key = f"{OTP_PREFIX}{email.lower().strip()}"
        return await r.exists(key) > 0
