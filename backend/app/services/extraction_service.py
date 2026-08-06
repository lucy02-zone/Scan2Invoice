from __future__ import annotations

import json
from typing import Any, Optional

from app.models.extracted_invoice import ExtractedInvoice
from app.repositories.extracted_invoice import ExtractedInvoiceRepository
from app.schemas.extracted_invoice import ExtractedInvoiceCreate


class ExtractionService:
    """Service layer for storing and managing invoice extraction results."""

    def __init__(self, extracted_invoice_repository: ExtractedInvoiceRepository) -> None:
        self.extracted_invoice_repository = extracted_invoice_repository

    async def create_extraction(self, extraction_data: ExtractedInvoiceCreate) -> ExtractedInvoice:
        """Persist structured invoice extraction data."""
        extracted_invoice = ExtractedInvoice(
            invoice_id=extraction_data.invoice_id,
            vendor_name=extraction_data.vendor_name,
            invoice_number=extraction_data.invoice_number,
            invoice_date=extraction_data.invoice_date,
            due_date=extraction_data.due_date,
            currency=extraction_data.currency,
            subtotal=extraction_data.subtotal,
            tax_amount=extraction_data.tax_amount,
            total_amount=extraction_data.total_amount,
            raw_json=extraction_data.raw_json,
        )
        return await self.extracted_invoice_repository.create(extracted_invoice)

    async def get_by_invoice_id(self, invoice_id: int) -> Optional[ExtractedInvoice]:
        """Retrieve structured extraction data for a given invoice."""
        return await self.extracted_invoice_repository.get_by_invoice_id(invoice_id)

    async def get_all_extractions(self, limit: int = 100, offset: int = 0) -> list[ExtractedInvoice]:
        """Retrieve all extractions ordered by creation date."""
        return await self.extracted_invoice_repository.get_all_ordered(limit=limit, offset=offset)

    def to_dict(self, payload: Any) -> str:
        """Serialize arbitrary payload data to JSON text."""
        return json.dumps(payload, default=str)
