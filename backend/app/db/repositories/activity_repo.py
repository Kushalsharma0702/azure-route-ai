"""
app.db.repositories.activity_repo — UserActivity repository.
"""

from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.activity import UserActivity


class ActivityRepository(BaseRepository[UserActivity]):
    def __init__(self, session: AsyncSession):
        super().__init__(UserActivity, session)

    async def get_user_feed(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 50,
    ) -> List[UserActivity]:
        """Get a user's activity feed, most recent first."""
        stmt = (
            select(UserActivity)
            .where(UserActivity.user_id == user_id)
            .order_by(UserActivity.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_action_type(
        self,
        action_type: str,
        skip: int = 0,
        limit: int = 100,
    ) -> List[UserActivity]:
        """Get activities filtered by action type (for analytics)."""
        stmt = (
            select(UserActivity)
            .where(UserActivity.action_type == action_type)
            .order_by(UserActivity.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
