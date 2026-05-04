"""
app.services.activity_service — User activity tracking business logic.
"""
import logging
from uuid import UUID
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.activity_repo import ActivityRepository
from app.models.activity import UserActivity

logger = logging.getLogger("activity_service")


class ActivityService:
    def __init__(self, db: AsyncSession):
        self.repo = ActivityRepository(db)
        self.db = db

    async def track(self, user_id: str, action_type: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        activity = UserActivity(user_id=UUID(user_id), action_type=action_type, metadata_=metadata or {})
        activity = await self.repo.create(activity)
        await self.repo.commit()
        logger.info("Activity tracked: user=%s action=%s", user_id, action_type)
        return {"id": activity.id, "action_type": activity.action_type, "created_at": activity.created_at.isoformat()}

    async def get_feed(self, user_id: str, skip: int = 0, limit: int = 50) -> Dict[str, Any]:
        activities = await self.repo.get_user_feed(UUID(user_id), skip, limit)
        total = await self.repo.count({"user_id": UUID(user_id)})
        items = [{"id": a.id, "action_type": a.action_type, "metadata": a.metadata_ or {}, "created_at": a.created_at.isoformat()} for a in activities]
        return {"activities": items, "total": total}
