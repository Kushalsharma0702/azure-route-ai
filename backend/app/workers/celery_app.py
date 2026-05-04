"""
app.workers.celery_app — Celery configuration.

Uses Redis as broker and result backend. Tasks are auto-discovered
from the workers package.
"""
from celery import Celery
from celery.schedules import crontab
from app.core import settings

celery_app = Celery(
    "routeaura",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,  # Re-deliver tasks if worker crashes
    worker_prefetch_multiplier=1,  # One task at a time (important for heavy AI tasks)
    result_expires=3600,
)

# Periodic task schedule (Celery Beat)
celery_app.conf.beat_schedule = {
    "refresh-popular-routes": {
        "task": "app.workers.travel_tasks.refresh_popular_routes",
        "schedule": 900.0,  # Every 15 minutes
    },
    "aggregate-analytics": {
        "task": "app.workers.analytics_tasks.aggregate_user_analytics",
        "schedule": crontab(minute=0),  # Every hour
    },
    "cleanup-expired-cache": {
        "task": "app.workers.travel_tasks.cleanup_expired_cache",
        "schedule": crontab(hour=3, minute=0),  # Daily at 3 AM
    },
}

celery_app.autodiscover_tasks(["app.workers"])
