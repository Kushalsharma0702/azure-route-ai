"""
app.core.security — Authentication and password utilities.

- JWT token generation/validation (access + refresh tokens)
- bcrypt password hashing with configurable cost factor
- Token payload structure for downstream authorization

Design decisions:
- HS256 chosen for simplicity; upgrade to RS256 for microservice architectures
  where public key verification is needed without sharing the secret.
- Refresh tokens use a separate "type" claim to prevent access token reuse.
- Password hashing cost factor 12 balances security vs. latency (~250ms).
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core import settings

# ── Password Hashing ──────────────────────────────────────────
# bcrypt with auto-upgrade: if the stored hash uses an older scheme,
# passlib transparently rehashes on next verify() call.
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,  # Cost factor 12 ≈ 250ms on modern hardware
)


def hash_password(plain: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    return pwd_context.verify(plain, hashed)


# ── JWT Tokens ────────────────────────────────────────────────

def create_access_token(
    user_id: UUID,
    role: str = "user",
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a short-lived access token.

    Payload:
        sub  — user UUID (string)
        role — user role for RBAC
        type — "access" to distinguish from refresh tokens
        exp  — expiration timestamp
        iat  — issued-at timestamp
    """
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

    payload = {
        "sub": str(user_id),
        "role": role,
        "type": "access",
        "exp": expire,
        "iat": now,
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(
    user_id: UUID,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a long-lived refresh token.

    Only contains 'sub' and 'type' — minimal claims to reduce
    exposure if the token is leaked.
    """
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "exp": expire,
        "iat": now,
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.

    Raises jose.JWTError on invalid/expired tokens.
    Returns the full payload dict.
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )


class TokenPayload:
    """Parsed token payload with typed fields."""

    def __init__(self, raw: dict):
        self.user_id: str = raw.get("sub", "")
        self.role: str = raw.get("role", "user")
        self.token_type: str = raw.get("type", "access")

    @classmethod
    def from_token(cls, token: str) -> "TokenPayload":
        return cls(decode_token(token))
