"""
app.db.repositories.voice_session_repo — VoiceSession repository.
"""

from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.voice_session import VoiceSession


class VoiceSessionRepository(BaseRepository[VoiceSession]):
    def __init__(self, session: AsyncSession):
        super().__init__(VoiceSession, session)

    async def get_user_sessions(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 20,
    ) -> List[VoiceSession]:
        """Get user's voice sessions, most recent first."""
        stmt = (
            select(VoiceSession)
            .where(VoiceSession.user_id == user_id)
            .order_by(VoiceSession.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
