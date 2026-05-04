"""
app.integrations.flight_client — Flight data API client.

Strategy:
- Primary: Aviationstack (free tier: 100 req/month)
- Secondary: Amadeus Test API (free tier)
- Fallback: Cached data or simulated response
- Pre-fetch: Popular routes refreshed via Celery every 15 min

Budget allocation: ~3 API calls/day per unique route.
"""

import logging
from typing import Dict, Any, Optional

import httpx

from app.core import settings
from app.cache.redis_client import cache_get, cache_set
from app.cache.cache_keys import CacheKeys

logger = logging.getLogger("flight_client")


class FlightClient:
    """Flight data API client with multi-provider fallback and caching."""

    @classmethod
    async def search_flights(
        cls,
        source: str,
        destination: str,
        date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Search flights between two airports (IATA codes)."""
        cache_key = CacheKeys.travel_route("flight", source, destination)

        # Check Redis cache
        cached = await cache_get(cache_key)
        if cached:
            logger.info("Flight search cache HIT: %s → %s", source, destination)
            return {**cached, "cached": True}

        # Try Aviationstack first
        data = await cls._fetch_aviationstack(source, destination, date)
        if data:
            await cache_set(cache_key, data, ttl_seconds=CacheKeys.TTL_TRAVEL)
            return {**data, "cached": False, "provider": "aviationstack"}

        # Fallback to Amadeus
        data = await cls._fetch_amadeus(source, destination, date)
        if data:
            await cache_set(cache_key, data, ttl_seconds=CacheKeys.TTL_TRAVEL)
            return {**data, "cached": False, "provider": "amadeus"}

        # Final fallback
        return {
            "flights": [],
            "source": source,
            "destination": destination,
            "cached": False,
            "error": "Flight data temporarily unavailable.",
        }

    @classmethod
    async def get_flight_status(
        cls,
        flight_number: str,
    ) -> Dict[str, Any]:
        """Get live status of a specific flight."""
        cache_key = f"flight:status:{flight_number}"

        cached = await cache_get(cache_key)
        if cached:
            return {**cached, "cached": True}

        data = await cls._fetch_flight_status(flight_number)
        if data:
            await cache_set(cache_key, data, ttl_seconds=300)
            return {**data, "cached": False}

        return {
            "flight_number": flight_number,
            "status": "unavailable",
            "error": "Flight status temporarily unavailable.",
        }

    @classmethod
    async def _fetch_aviationstack(
        cls,
        source: str,
        destination: str,
        date: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Fetch from Aviationstack API."""
        api_key = settings.AVIATIONSTACK_API_KEY
        if not api_key:
            logger.debug("AVIATIONSTACK_API_KEY not set")
            return None

        params = {
            "access_key": api_key,
            "dep_iata": source.upper(),
            "arr_iata": destination.upper(),
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    "http://api.aviationstack.com/v1/flights",
                    params=params,
                )
            if resp.status_code != 200:
                logger.warning("Aviationstack error: %d", resp.status_code)
                return None

            raw = resp.json()
            flights = []
            for item in (raw.get("data") or [])[:10]:
                flights.append({
                    "airline": item.get("airline", {}).get("name", "Unknown"),
                    "flight_number": item.get("flight", {}).get("iata", ""),
                    "departure": item.get("departure", {}).get("scheduled", ""),
                    "arrival": item.get("arrival", {}).get("scheduled", ""),
                    "status": item.get("flight_status", ""),
                })

            return {"source": source, "destination": destination, "flights": flights}

        except Exception as e:
            logger.warning("Aviationstack API error: %s", e)
            return None

    @classmethod
    async def _fetch_amadeus(
        cls,
        source: str,
        destination: str,
        date: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Fetch from Amadeus Test API."""
        api_key = settings.AMADEUS_API_KEY
        api_secret = settings.AMADEUS_API_SECRET
        if not api_key or not api_secret:
            logger.debug("Amadeus credentials not set")
            return None

        try:
            # Get access token
            async with httpx.AsyncClient(timeout=15.0) as client:
                token_resp = await client.post(
                    "https://test.api.amadeus.com/v1/security/oauth2/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": api_key,
                        "client_secret": api_secret,
                    },
                )
            if token_resp.status_code != 200:
                logger.warning("Amadeus token error: %d", token_resp.status_code)
                return None

            access_token = token_resp.json().get("access_token")

            # Search flights
            params = {
                "originLocationCode": source.upper(),
                "destinationLocationCode": destination.upper(),
                "departureDate": date or "2025-12-01",
                "adults": 1,
                "max": 5,
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    "https://test.api.amadeus.com/v2/shopping/flight-offers",
                    params=params,
                    headers={"Authorization": f"Bearer {access_token}"},
                )

            if resp.status_code != 200:
                return None

            raw = resp.json()
            flights = []
            for offer in (raw.get("data") or []):
                segments = offer.get("itineraries", [{}])[0].get("segments", [])
                if segments:
                    seg = segments[0]
                    flights.append({
                        "airline": seg.get("carrierCode", ""),
                        "flight_number": f"{seg.get('carrierCode', '')}{seg.get('number', '')}",
                        "departure": seg.get("departure", {}).get("at", ""),
                        "arrival": seg.get("arrival", {}).get("at", ""),
                        "price": offer.get("price", {}).get("total", ""),
                    })

            return {"source": source, "destination": destination, "flights": flights}

        except Exception as e:
            logger.warning("Amadeus API error: %s", e)
            return None

    @classmethod
    async def _fetch_flight_status(cls, flight_number: str) -> Optional[Dict[str, Any]]:
        """Fetch live flight status."""
        api_key = settings.AVIATIONSTACK_API_KEY
        if not api_key:
            return cls._simulated_flight_status(flight_number)

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    "http://api.aviationstack.com/v1/flights",
                    params={"access_key": api_key, "flight_iata": flight_number},
                )
            if resp.status_code != 200:
                return None

            raw = resp.json()
            data = (raw.get("data") or [None])[0]
            if not data:
                return None

            return {
                "flight_number": flight_number,
                "status": data.get("flight_status", "unknown"),
                "departure": data.get("departure", {}),
                "arrival": data.get("arrival", {}),
            }
        except Exception as e:
            logger.warning("Flight status API error: %s", e)
            return None

    @staticmethod
    def _simulated_flight_status(flight_number: str) -> Dict[str, Any]:
        """Dev/test fallback."""
        return {
            "flight_number": flight_number,
            "status": "scheduled",
            "departure": {"scheduled": "10:00", "terminal": "T2"},
            "arrival": {"scheduled": "12:30", "terminal": "T1"},
        }
