"""
app.services.auth_service — Authentication business logic with OTP support.

Flow:
  signup → sends OTP to email → user verifies OTP → account activated → JWT issued
  login → email + password → JWT issued (only if email_verified)
"""
import logging
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token, TokenPayload
from app.core.exceptions import AuthenticationError, ConflictError, NotFoundError, ValidationError
from app.db.repositories.user_repo import UserRepository
from app.models.user import User
from app.services.otp_service import OTPService

logger = logging.getLogger("auth_service")


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)
        self.db = db

    async def signup(self, email: str, password: str, name: str = None, phone: str = None) -> dict:
        """Register user and send OTP to their email."""
        email = email.lower().strip()
        if await self.repo.email_exists(email):
            raise ConflictError(f"Email '{email}' is already registered")

        user = User(
            email=email,
            hashed_password=hash_password(password),
            role="user",
            name=name,
            phone=phone,
            email_verified=False,
        )
        user = await self.repo.create(user)
        await self.repo.commit()

        # Generate and "send" OTP (logged to console in dev)
        otp = await OTPService.generate_otp(email)

        return {
            "message": "Account created. Please verify your email with the OTP sent.",
            "email": email,
            "otp_sent": True,
            "user_id": str(user.id),
            "otp": otp,  # Return OTP for frontend display while mailjet is blocked
        }

    async def verify_otp(self, email: str, otp: str) -> dict:
        """Verify OTP and activate the user account, then issue JWT tokens."""
        email = email.lower().strip()

        is_valid = await OTPService.verify_otp(email, otp)
        if not is_valid:
            raise AuthenticationError("Invalid or expired OTP")

        user = await self.repo.get_by_email(email)
        if not user:
            raise NotFoundError("User", email)

        # Mark email as verified
        user.email_verified = True
        await self.repo.commit()

        # Issue tokens
        access = create_access_token(user.id, user.role)
        refresh = create_refresh_token(user.id)

        logger.info("Email verified: %s", email)
        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "email_verified": True,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role,
            },
        }

    async def resend_otp(self, email: str) -> dict:
        """Resend OTP to an existing unverified user."""
        email = email.lower().strip()
        user = await self.repo.get_by_email(email)
        if not user:
            raise NotFoundError("User", email)

        otp = await OTPService.generate_otp(email)
        return {"message": "OTP resent", "email": email, "otp_sent": True, "otp": otp}

    async def login(self, email: str, password: str) -> dict:
        """Login with email + password. Requires email_verified=True."""
        email = email.lower().strip()
        user = await self.repo.get_by_email(email)
        if not user or not user.is_active:
            raise AuthenticationError("Invalid email or password")
        if not verify_password(password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")
        if not user.email_verified:
            # Auto-resend OTP
            otp = await OTPService.generate_otp(email)
            raise AuthenticationError(
                f"Email not verified. Your new verification code is: {otp}"
            )

        access = create_access_token(user.id, user.role)
        refresh = create_refresh_token(user.id)
        logger.info("User logged in: %s", email)
        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role,
            },
        }

    async def refresh_token(self, refresh_token_str: str) -> dict:
        try:
            payload = TokenPayload.from_token(refresh_token_str)
        except Exception:
            raise AuthenticationError("Invalid refresh token")
        if payload.token_type != "refresh":
            raise AuthenticationError("Invalid token type — expected refresh token")

        user = await self.repo.get_by_id(UUID(payload.user_id))
        if not user or not user.is_active:
            raise AuthenticationError("User not found or deactivated")

        access = create_access_token(user.id, user.role)
        refresh = create_refresh_token(user.id)
        return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}

    async def get_profile(self, user_id: str) -> dict:
        user = await self.repo.get_by_id(UUID(user_id))
        if not user:
            raise NotFoundError("User", user_id)
        return {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "email_verified": user.email_verified,
            "preferences": user.preferences or {},
            "created_at": user.created_at.isoformat(),
        }

    async def update_preferences(self, user_id: str, preferences: dict) -> dict:
        """Update a user's JSON preferences"""
        from uuid import UUID
        user = await self.repo.get_by_id(UUID(user_id))
        if not user:
            raise NotFoundError("User", user_id)
            
        # Merge existing preferences with new ones
        current_prefs = user.preferences or {}
        user.preferences = {**current_prefs, **preferences}
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return {
            "message": "Preferences updated successfully",
            "preferences": user.preferences
        }
