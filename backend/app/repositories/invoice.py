from __future__ import annotations

from typing import Optional

from sqlalchemy import select
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
