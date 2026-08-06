from __future__ import annotations

from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.invoice import Invoice
from app.repositories.base import BaseRepository


class InvoiceRepository(BaseRepository[Invoice]):
    """Repository for invoice persistence and lookup operations."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session=session, model=Invoice)

    async def get_by_filename(self, filename: str) -> Optional[Invoice]:
        """Retrieve an invoice by filename."""
        result = await self.session.execute(select(Invoice).where(Invoice.filename == filename))
        return result.scalar_one_or_none()

    async def get_all_ordered(self, limit: int = 100, offset: int = 0) -> list[Invoice]:
        """Retrieve invoices ordered by creation date (newest first)."""
        result = await self.session.execute(
            select(Invoice).order_by(Invoice.created_at.desc()).limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def count_by_status(self) -> dict[str, int]:
        """Count invoices grouped by status."""
        result = await self.session.execute(
            select(Invoice.status, func.count(Invoice.id)).group_by(Invoice.status)
        )
        return {row[0]: row[1] for row in result.all()}

    async def count_total(self) -> int:
        """Return total number of invoices."""
        result = await self.session.execute(select(func.count(Invoice.id)))
        return result.scalar_one()
