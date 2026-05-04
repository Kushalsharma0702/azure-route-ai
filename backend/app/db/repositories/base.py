"""
app.db.repositories.base — Generic async CRUD repository.

This is the foundation for all entity-specific repositories.
Provides type-safe, async CRUD operations with:
- Generic typing (Repository[User] gives you typed returns)
- Pagination built in (offset/limit)
- Filtering by arbitrary columns
- Soft-delete support

Services inject a session and call repository methods — this keeps
SQLAlchemy concerns completely isolated from business logic.
"""

from typing import Generic, TypeVar, Type, Optional, List, Any, Dict
from uuid import UUID

from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

# Generic type variable bound to our Base model
ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Generic async repository providing CRUD operations.

    Usage:
        class UserRepo(BaseRepository[User]):
            def __init__(self, session):
                super().__init__(User, session)
    """

    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id: Any) -> Optional[ModelType]:
        """Fetch a single record by primary key."""
        return await self.session.get(self.model, id)

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        order_by: Optional[str] = None,
        descending: bool = True,
    ) -> List[ModelType]:
        """Fetch paginated list of records."""
        stmt = select(self.model)

        if order_by and hasattr(self.model, order_by):
            col = getattr(self.model, order_by)
            stmt = stmt.order_by(col.desc() if descending else col.asc())

        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_field(self, field: str, value: Any) -> Optional[ModelType]:
        """Fetch a single record by an arbitrary field."""
        if not hasattr(self.model, field):
            raise ValueError(f"Model {self.model.__name__} has no field '{field}'")
        stmt = select(self.model).where(getattr(self.model, field) == value)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_many_by_field(
        self,
        field: str,
        value: Any,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ModelType]:
        """Fetch multiple records matching a field value."""
        if not hasattr(self.model, field):
            raise ValueError(f"Model {self.model.__name__} has no field '{field}'")
        stmt = (
            select(self.model)
            .where(getattr(self.model, field) == value)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create(self, obj: ModelType) -> ModelType:
        """Insert a new record and return it with generated fields populated."""
        self.session.add(obj)
        await self.session.flush()  # Populate server-generated defaults (id, timestamps)
        await self.session.refresh(obj)
        return obj

    async def create_many(self, objects: List[ModelType]) -> List[ModelType]:
        """Bulk insert multiple records."""
        self.session.add_all(objects)
        await self.session.flush()
        for obj in objects:
            await self.session.refresh(obj)
        return objects

    async def update_by_id(self, id: Any, values: Dict[str, Any]) -> Optional[ModelType]:
        """Update a record by primary key with the given field values."""
        stmt = (
            update(self.model)
            .where(self.model.id == id)
            .values(**values)
            .returning(self.model)
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.scalar_one_or_none()

    async def delete_by_id(self, id: Any) -> bool:
        """Hard-delete a record by primary key. Returns True if deleted."""
        stmt = delete(self.model).where(self.model.id == id)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records, optionally filtered."""
        stmt = select(func.count()).select_from(self.model)
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def exists(self, field: str, value: Any) -> bool:
        """Check if a record exists with the given field value."""
        stmt = (
            select(func.count())
            .select_from(self.model)
            .where(getattr(self.model, field) == value)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one() > 0

    async def commit(self):
        """Commit the current transaction."""
        await self.session.commit()

    async def rollback(self):
        """Rollback the current transaction."""
        await self.session.rollback()
