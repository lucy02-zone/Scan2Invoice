from __future__ import annotations

from typing import AsyncGenerator, Optional

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

_engine: Optional[object] = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def _build_database_url() -> str:
    """Return a database URL suitable for async SQLAlchemy usage."""
    database_url = settings.DATABASE_URL
    if database_url.startswith("sqlite"):
        return database_url.replace("sqlite://", "sqlite+aiosqlite://")
    return database_url


def get_engine() -> object:
    """Create and cache the async SQLAlchemy engine lazily."""
    global _engine
    if _engine is None:
        _engine = create_async_engine(
            _build_database_url(),
            echo=settings.DEBUG,
            pool_pre_ping=True,
        )
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Create and cache the async session factory."""
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            bind=get_engine(),
            expire_on_commit=False,
            autoflush=False,
            autocommit=False,
        )
    return _session_factory


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async SQLAlchemy session for dependency injection."""
    session_factory = get_session_factory()
    async with session_factory() as session:
        yield session
