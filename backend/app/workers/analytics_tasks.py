"""
app.workers.analytics_tasks — Analytics background tasks.
"""
import asyncio
import logging
from app.workers.celery_app import celery_app

logger = logging.getLogger("analytics_tasks")


@celery_app.task(name="app.workers.analytics_tasks.aggregate_user_analytics")
def aggregate_user_analytics():
    """Aggregate user activity data for dashboard metrics."""
    logger.info("Starting analytics aggregation")

    async def _aggregate():
        from app.db.session import AsyncSessionLocal
        from sqlalchemy import text

        async with AsyncSessionLocal() as session:
            # Count activities by type in the last hour
            result = await session.execute(text(
                "SELECT action_type, COUNT(*) as count "
                "FROM user_activity "
                "WHERE created_at > NOW() - INTERVAL '1 hour' "
                "GROUP BY action_type"
            ))
            rows = result.fetchall()
            for row in rows:
                logger.info("Analytics: action=%s count=%d", row[0], row[1])

    asyncio.run(_aggregate())
    logger.info("Analytics aggregation complete")
