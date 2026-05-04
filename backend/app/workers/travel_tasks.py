"""
app.workers.travel_tasks — Background tasks for travel data.

These tasks run in Celery workers, not in the FastAPI process.
They pre-fetch popular routes so users get instant cache hits.
"""
import asyncio
import logging
from app.workers.celery_app import celery_app

logger = logging.getLogger("travel_tasks")

# Popular routes to pre-fetch (expand based on analytics)
POPULAR_ROUTES = [
    ("train", "NDLS", "BCT"),  # Delhi → Mumbai
    ("train", "MAS", "SBC"),   # Chennai → Bangalore
    ("train", "HWH", "NDLS"),  # Kolkata → Delhi
    ("flight", "DEL", "BOM"),  # Delhi → Mumbai
    ("flight", "BLR", "DEL"),  # Bangalore → Delhi
    ("flight", "MAA", "BLR"), # Chennai → Bangalore
]


@celery_app.task(name="app.workers.travel_tasks.refresh_popular_routes")
def refresh_popular_routes():
    """Pre-fetch travel data for popular routes."""
    logger.info("Starting popular routes refresh (%d routes)", len(POPULAR_ROUTES))

    async def _refresh():
        from app.integrations.train_client import TrainClient
        from app.integrations.flight_client import FlightClient

        for transport_type, source, destination in POPULAR_ROUTES:
            try:
                if transport_type == "train":
                    await TrainClient.search_trains(source, destination)
                else:
                    await FlightClient.search_flights(source, destination)
                logger.info("Refreshed: %s %s → %s", transport_type, source, destination)
            except Exception as e:
                logger.warning("Failed to refresh %s %s → %s: %s", transport_type, source, destination, e)

    asyncio.run(_refresh())
    logger.info("Popular routes refresh complete")


@celery_app.task(name="app.workers.travel_tasks.cleanup_expired_cache")
def cleanup_expired_cache():
    """Remove expired travel cache entries from PostgreSQL."""
    logger.info("Starting expired cache cleanup")

    async def _cleanup():
        from app.db.session import AsyncSessionLocal
        from app.db.repositories.travel_cache_repo import TravelCacheRepository

        async with AsyncSessionLocal() as session:
            repo = TravelCacheRepository(session)
            count = await repo.cleanup_expired()
            await repo.commit()
            logger.info("Cleaned up %d expired cache entries", count)

    asyncio.run(_cleanup())
