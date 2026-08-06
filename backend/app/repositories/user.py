from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for user persistence and lookup operations."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session=session, model=User)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by email address."""
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
