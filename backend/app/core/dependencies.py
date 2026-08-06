from __future__ import annotations

from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide a database session for request-scoped dependency injection."""
    async for session in get_db_session():
        yield session


async def require_auth() -> None:
    """Placeholder authentication dependency for future JWT enforcement."""
    return None


AuthDependency = Depends(require_auth)
