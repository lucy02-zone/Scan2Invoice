from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional

from app.models.invoice import Invoice, InvoiceStatus
from app.repositories.invoice import InvoiceRepository
from app.schemas.invoice import InvoiceCreate


class InvoiceService:
    """Service layer for invoice domain operations."""

    def __init__(self, invoice_repository: InvoiceRepository) -> None:
        self.invoice_repository = invoice_repository

    async def create_invoice(self, invoice_data: InvoiceCreate) -> Invoice:
        """Persist a new invoice record after validating its filename."""
        if not invoice_data.filename:
            raise ValueError("Invoice filename is required")

        invoice = Invoice(
            filename=invoice_data.filename,
            content_type=invoice_data.content_type,
            storage_path=invoice_data.storage_path,
            status=invoice_data.status,
            extracted_text=invoice_data.extracted_text,
            extracted_data=invoice_data.extracted_data,
        )
        return await self.invoice_repository.create(invoice)

    async def get_invoice(self, invoice_id: int) -> Optional[Invoice]:
        """Retrieve an invoice by id."""
        return await self.invoice_repository.get_by_id(invoice_id)

    async def get_all_invoices(self, limit: int = 100, offset: int = 0) -> list[Invoice]:
        """Retrieve all invoices ordered by creation date."""
        return await self.invoice_repository.get_all_ordered(limit=limit, offset=offset)

    async def get_stats(self) -> Dict[str, Any]:
        """Return dashboard statistics computed from the database."""
        total = await self.invoice_repository.count_total()
        status_counts = await self.invoice_repository.count_by_status()
        return {
            "total_invoices": total,
            "completed": status_counts.get(InvoiceStatus.COMPLETED.value, 0),
            "processing": status_counts.get(InvoiceStatus.PROCESSING.value, 0),
            "uploaded": status_counts.get(InvoiceStatus.UPLOADED.value, 0),
            "failed": status_counts.get(InvoiceStatus.FAILED.value, 0),
        }

    async def mark_processing(self, invoice: Invoice) -> Invoice:
        """Mark an invoice as processing."""
        invoice.status = InvoiceStatus.PROCESSING.value
        return await self.invoice_repository.update(invoice)

    async def mark_completed(self, invoice: Invoice, extracted_text: str, extracted_data: str) -> Invoice:
        """Mark an invoice as completed and store extracted content."""
        invoice.status = InvoiceStatus.COMPLETED.value
        invoice.extracted_text = extracted_text
        invoice.extracted_data = extracted_data
        return await self.invoice_repository.update(invoice)

    async def mark_failed(self, invoice: Invoice, error_message: str) -> Invoice:
        """Mark an invoice as failed when extraction errors occur."""
        invoice.status = InvoiceStatus.FAILED.value
        invoice.extracted_data = error_message
        return await self.invoice_repository.update(invoice)

