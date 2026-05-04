"""
app.db.repositories.user_repo — User-specific repository.
"""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Find user by email (case-insensitive)."""
        stmt = select(User).where(User.email == email.lower())
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        """Check if email is already registered."""
        return await self.exists("email", email.lower())

    async def update_preferences(self, user_id: UUID, preferences: dict) -> Optional[User]:
        """Merge new preferences into existing JSONB."""
        user = await self.get_by_id(user_id)
        if not user:
            return None
        current = user.preferences or {}
        current.update(preferences)
        return await self.update_by_id(user_id, {"preferences": current})

    async def deactivate(self, user_id: UUID) -> Optional[User]:
        """Soft-delete a user (set is_active=False)."""
        return await self.update_by_id(user_id, {"is_active": False})
