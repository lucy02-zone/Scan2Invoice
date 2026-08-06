from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.repositories.invoice import InvoiceRepository
from app.services.invoice_service import InvoiceService

router = APIRouter()


def get_invoice_service(session: AsyncSession = Depends(get_db)) -> InvoiceService:
    """Create an invoice service from an injected database session."""
    repository = InvoiceRepository(session)
    return InvoiceService(repository)


@router.get("/stats")
async def get_dashboard_stats(
    invoice_service: InvoiceService = Depends(get_invoice_service),
) -> Dict[str, Any]:
    """Retrieve dashboard statistics."""
    return await invoice_service.get_stats()
