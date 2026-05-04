"""
app.core.dependencies — FastAPI dependency injection.

Centralized DI functions that routes use via Depends().
This is the glue between the HTTP layer and the service/repository layers.

Key patterns:
- get_db: yields an async DB session (auto-closes on request end)
- get_current_user: extracts + validates JWT from Authorization header
- require_role: factory for role-based access control
"""

from typing import AsyncGenerator
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import TokenPayload, decode_token
from app.db.session import AsyncSessionLocal

# HTTP Bearer scheme — extracts "Bearer <token>" from Authorization header
security_scheme = HTTPBearer(auto_error=True)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an async SQLAlchemy session.

    The session is scoped to the request lifecycle — it's created when
    the dependency is resolved and closed when the request completes.
    Using expire_on_commit=False so that objects remain usable after commit.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> TokenPayload:
    """
    Dependency that validates the JWT and returns the parsed token payload.

    Raises 401 if:
    - Token is missing or malformed
    - Token is expired
    - Token type is not "access" (prevents refresh token misuse)
    """
    try:
        payload = decode_token(credentials.credentials)
        token = TokenPayload(payload)

        if token.token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type — expected access token",
            )

        if not token.user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing user identifier",
            )

        return token

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(*allowed_roles: str):
    """
    Factory that returns a dependency enforcing role-based access.

    Usage:
        @router.get("/admin", dependencies=[Depends(require_role("admin"))])
        async def admin_only(): ...
    """
    async def _check_role(
        current_user: TokenPayload = Depends(get_current_user),
    ) -> TokenPayload:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not authorized. Required: {allowed_roles}",
            )
        return current_user

    return _check_role


# ── Optional Auth (for Hotel-CRM admin panel) ────────────────
# Hotel-CRM admin has no login flow — it manages rooms/bookings
# directly. These endpoints accept an optional JWT but don't
# require one. In production, gate this behind a proper admin auth.

optional_security_scheme = HTTPBearer(auto_error=False)


async def optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_security_scheme),
) -> TokenPayload | None:
    """
    Like get_current_user but returns None instead of 403 when
    no token is provided. Use for Hotel-CRM admin endpoints.
    """
    if credentials is None:
        return None
    try:
        payload = decode_token(credentials.credentials)
        token = TokenPayload(payload)
        if token.token_type != "access" or not token.user_id:
            return None
        return token
    except JWTError:
        return None

