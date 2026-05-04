"""
app.db.repositories.place_repo — Place-specific repository.
"""

from typing import List, Optional

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.place import Place


class PlaceRepository(BaseRepository[Place]):
    def __init__(self, session: AsyncSession):
        super().__init__(Place, session)

    async def search_by_name(self, query: str, limit: int = 20) -> List[Place]:
        """
        Fuzzy search places by name using ILIKE.
        For trigram search, use: WHERE name % :query (requires pg_trgm).
        """
        stmt = (
            select(Place)
            .where(
                and_(
                    Place.name.ilike(f"%{query}%"),
                    Place.is_active == True,
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def find_nearby(
        self,
        lat: float,
        lng: float,
        radius_deg: float = 0.1,  # ~11km at equator
        limit: int = 20,
    ) -> List[Place]:
        """
        Find places within a bounding box.

        This is a simple rectangular approximation. For production
        geo queries, upgrade to PostGIS with ST_DWithin.
        """
        stmt = (
            select(Place)
            .where(
                and_(
                    Place.latitude.between(lat - radius_deg, lat + radius_deg),
                    Place.longitude.between(lng - radius_deg, lng + radius_deg),
                    Place.is_active == True,
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_category(
        self,
        category: str,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Place]:
        """Get active places in a specific category."""
        stmt = (
            select(Place)
            .where(
                and_(
                    Place.category == category,
                    Place.is_active == True,
                )
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
