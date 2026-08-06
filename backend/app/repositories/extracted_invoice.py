from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.extracted_invoice import ExtractedInvoice
from app.repositories.base import BaseRepository


class ExtractedInvoiceRepository(BaseRepository[ExtractedInvoice]):
    """Repository for extracted invoice persistence and lookup operations."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session=session, model=ExtractedInvoice)

    async def get_by_invoice_id(self, invoice_id: int) -> Optional[ExtractedInvoice]:
        """Retrieve extracted invoice data by the parent invoice id."""
        result = await self.session.execute(
            select(ExtractedInvoice).where(ExtractedInvoice.invoice_id == invoice_id)
        )
        return result.scalar_one_or_none()
