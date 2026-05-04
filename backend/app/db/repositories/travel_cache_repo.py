"""
app.db.repositories.travel_cache_repo — TravelCache repository.

Implements upsert semantics: if a route already exists in the cache,
update it instead of creating a duplicate (thanks to the UNIQUE constraint).
"""

from typing import Optional
from datetime import datetime, timezone, timedelta

from sqlalchemy import select, and_, delete
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.travel_cache import TravelCache


class TravelCacheRepository(BaseRepository[TravelCache]):
    def __init__(self, session: AsyncSession):
        super().__init__(TravelCache, session)

    async def get_cached_route(
        self,
        transport_type: str,
        source: str,
        destination: str,
    ) -> Optional[TravelCache]:
        """
        Get cached data for a specific route if not expired.
        Returns None if no cache exists or if the cache has expired.
        """
        now = datetime.now(timezone.utc)
        stmt = select(TravelCache).where(
            and_(
                TravelCache.transport_type == transport_type,
                TravelCache.source == source.lower(),
                TravelCache.destination == destination.lower(),
                TravelCache.expires_at > now,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def upsert_route(
        self,
        transport_type: str,
        source: str,
        destination: str,
        data: dict,
        ttl_minutes: int = 15,
    ) -> TravelCache:
        """
        Insert or update cached travel data using PostgreSQL ON CONFLICT.

        This is an atomic upsert — no race conditions when multiple
        workers try to cache the same route simultaneously.
        """
        now = datetime.now(timezone.utc)
        expires = now + timedelta(minutes=ttl_minutes)

        stmt = pg_insert(TravelCache).values(
            transport_type=transport_type,
            source=source.lower(),
            destination=destination.lower(),
            data=data,
            fetched_at=now,
            expires_at=expires,
        ).on_conflict_do_update(
            constraint="uq_travel_cache_route",
            set_={
                "data": data,
                "fetched_at": now,
                "expires_at": expires,
            },
        ).returning(TravelCache)

        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.scalar_one()

    async def cleanup_expired(self) -> int:
        """Delete all expired cache entries. Returns count of deleted rows."""
        now = datetime.now(timezone.utc)
        stmt = delete(TravelCache).where(TravelCache.expires_at < now)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount
