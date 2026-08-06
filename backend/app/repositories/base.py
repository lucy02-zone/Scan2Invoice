from __future__ import annotations

from typing import Generic, Optional, Type, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository providing common CRUD operations for SQLAlchemy models."""

    def __init__(self, session: AsyncSession, model: Type[ModelType]) -> None:
        self.session = session
        self.model = model

    async def create(self, obj: ModelType) -> ModelType:
        """Create and persist a new model instance."""
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_by_id(self, obj_id: int) -> Optional[ModelType]:
        """Retrieve a model instance by its primary key."""
        result = await self.session.execute(select(self.model).where(self.model.id == obj_id))
        return result.scalar_one_or_none()

    async def get_all(self) -> list[ModelType]:
        """Retrieve all model instances."""
        result = await self.session.execute(select(self.model))
        return list(result.scalars().all())

    async def update(self, obj: ModelType) -> ModelType:
        """Persist updates to an existing model instance."""
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def delete(self, obj: ModelType) -> None:
        """Delete a model instance from the database."""
        await self.session.delete(obj)
        await self.session.commit()
