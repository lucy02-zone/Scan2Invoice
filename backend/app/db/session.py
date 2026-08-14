from __future__ import annotations

from typing import AsyncGenerator, Optional

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models.base import Base

# Import models so their metadata is registered before table creation.
from app.models.extracted_invoice import ExtractedInvoice as _extracted_invoice_model  # noqa: F401
from app.models.invoice import Invoice as _invoice_model  # noqa: F401
from app.models.user import User as _user_model  # noqa: F401

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
            # Keep SQL text echo disabled — control logging via Python's
            # logging module to avoid noisy BEGIN/ROLLBACK lines in output.
            echo=False,
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


async def init_db() -> None:
    """Create database tables for all registered SQLAlchemy models."""
    engine = get_engine()
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async SQLAlchemy session for dependency injection."""
    session_factory = get_session_factory()
    async with session_factory() as session:
        yield session
