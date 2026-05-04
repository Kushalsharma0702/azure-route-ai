"""
app.services.travel_service — Travel status business logic.
Orchestrates train/flight clients with DB cache persistence.
"""
import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.integrations.train_client import TrainClient
from app.integrations.flight_client import FlightClient
from app.db.repositories.travel_cache_repo import TravelCacheRepository

logger = logging.getLogger("travel_service")


class TravelService:
    def __init__(self, db: AsyncSession):
        self.cache_repo = TravelCacheRepository(db)
        self.db = db

    async def search(self, transport_type: str, source: str, destination: str, date: Optional[str] = None) -> Dict[str, Any]:
        # Check DB cache first
        db_cached = await self.cache_repo.get_cached_route(transport_type, source, destination)
        if db_cached and not db_cached.is_expired:
            return {"results": [{"transport_type": transport_type, "source": source, "destination": destination, "data": db_cached.data, "cached": True, "fetched_at": db_cached.fetched_at.isoformat()}], "source": "cache", "total": 1}

        # Fetch live data
        if transport_type == "train":
            data = await TrainClient.search_trains(source, destination, date)
        else:
            data = await FlightClient.search_flights(source, destination, date)

        # Persist to DB cache
        if data and "error" not in data:
            await self.cache_repo.upsert_route(transport_type, source, destination, data)
            await self.cache_repo.commit()

        return {"results": [{"transport_type": transport_type, "source": source, "destination": destination, "data": data, "cached": False}], "source": "live", "total": 1}

    async def get_train_status(self, train_number: str, date: Optional[str] = None) -> Dict[str, Any]:
        return await TrainClient.get_train_status(train_number, date)

    async def get_flight_status(self, flight_number: str) -> Dict[str, Any]:
        return await FlightClient.get_flight_status(flight_number)
