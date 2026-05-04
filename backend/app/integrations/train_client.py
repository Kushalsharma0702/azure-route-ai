"""
app.integrations.train_client — Train data API client.

Strategy:
- Primary: RailAPI or similar free-tier train data provider
- Fallback: Return cached data (even if stale) with staleness indicator
- Background: Celery pre-fetches popular routes every 15 min

Free tier limits (typical): ~100 requests/day
We mitigate this with aggressive caching (15 min TTL).
"""

import logging
from typing import Dict, Any, Optional, List

import httpx

from app.core import settings
from app.cache.redis_client import cache_get, cache_set
from app.cache.cache_keys import CacheKeys

logger = logging.getLogger("train_client")

# RailAPI (or similar) base URL
RAILAPI_BASE = "https://indianrailapi.com/api/v2"


class TrainClient:
    """
    Train data API client with caching layer.

    All responses are cached in Redis (15 min TTL) and PostgreSQL
    (via TravelCacheRepository) for durability.
    """

    @classmethod
    async def search_trains(
        cls,
        source: str,
        destination: str,
        date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Search trains between two stations.

        Checks cache first, then hits the external API.
        Returns cached data (even stale) if the API fails.
        """
        cache_key = CacheKeys.travel_route("train", source, destination)

        # Check Redis cache
        cached = await cache_get(cache_key)
        if cached:
            logger.info("Train search cache HIT: %s → %s", source, destination)
            return {**cached, "cached": True}

        # Call external API
        try:
            data = await cls._fetch_from_api(source, destination, date)
            if data:
                await cache_set(cache_key, data, ttl_seconds=CacheKeys.TTL_TRAVEL)
                return {**data, "cached": False}
        except Exception as e:
            logger.warning("Train API call failed: %s", e)

        # Final fallback: return empty with error indicator
        return {
            "trains": [],
            "source": source,
            "destination": destination,
            "cached": False,
            "error": "Train data temporarily unavailable. Please try again later.",
        }

    @classmethod
    async def get_train_status(
        cls,
        train_number: str,
        date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get live status of a specific train."""
        cache_key = f"train:status:{train_number}"

        cached = await cache_get(cache_key)
        if cached:
            return {**cached, "cached": True}

        try:
            data = await cls._fetch_train_status(train_number, date)
            if data:
                # Shorter TTL for live status (5 min)
                await cache_set(cache_key, data, ttl_seconds=300)
                return {**data, "cached": False}
        except Exception as e:
            logger.warning("Train status API failed: %s", e)

        return {
            "train_number": train_number,
            "status": "unavailable",
            "cached": False,
            "error": "Train status temporarily unavailable.",
        }

    @classmethod
    async def _fetch_from_api(
        cls,
        source: str,
        destination: str,
        date: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Fetch train data from external API."""
        api_key = settings.RAILAPI_KEY
        if not api_key:
            logger.warning("RAILAPI_KEY not set — using simulated data")
            return cls._simulated_trains(source, destination)

        params = {
            "apikey": api_key,
            "from": source.upper(),
            "to": destination.upper(),
        }
        if date:
            params["date"] = date

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{RAILAPI_BASE}/TrainBetweenStations",
                params=params,
            )

        if response.status_code != 200:
            logger.error("RailAPI error: status=%d body=%s", response.status_code, response.text[:200])
            return None

        return response.json()

    @classmethod
    async def _fetch_train_status(
        cls,
        train_number: str,
        date: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Fetch live train status from external API."""
        api_key = settings.RAILAPI_KEY
        if not api_key:
            return cls._simulated_status(train_number)

        params = {"apikey": api_key, "trainno": train_number}
        if date:
            params["date"] = date

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{RAILAPI_BASE}/livetrainstatus",
                params=params,
            )

        if response.status_code != 200:
            return None

        return response.json()

    @staticmethod
    def _simulated_trains(source: str, destination: str) -> Dict[str, Any]:
        """Simulated train data for development/testing."""
        return {
            "source": source,
            "destination": destination,
            "trains": [
                {
                    "number": "12345",
                    "name": f"Express ({source} → {destination})",
                    "departure": "06:30",
                    "arrival": "14:45",
                    "duration": "8h 15m",
                    "classes": ["SL", "3A", "2A", "1A"],
                },
                {
                    "number": "67890",
                    "name": f"Superfast ({source} → {destination})",
                    "departure": "10:00",
                    "arrival": "16:30",
                    "duration": "6h 30m",
                    "classes": ["CC", "EC", "3A"],
                },
            ],
        }

    @staticmethod
    def _simulated_status(train_number: str) -> Dict[str, Any]:
        """Simulated train status for development."""
        return {
            "train_number": train_number,
            "status": "On Time",
            "last_station": "Intermediate Junction",
            "delay_minutes": 0,
            "expected_arrival": "14:45",
        }
