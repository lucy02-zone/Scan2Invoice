from __future__ import annotations

from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.repositories.invoice import InvoiceRepository
from app.schemas.invoice import InvoiceResponse
from app.services.invoice_service import InvoiceService

router = APIRouter()


def get_invoice_service(session: AsyncSession = Depends(get_db)) -> InvoiceService:
    """Create an invoice service from an injected database session."""
    repository = InvoiceRepository(session)
    return InvoiceService(repository)


@router.get("", response_model=List[InvoiceResponse])
async def list_invoices(
    limit: int = 100,
    offset: int = 0,
    invoice_service: InvoiceService = Depends(get_invoice_service),
) -> List[InvoiceResponse]:
    """List all invoices ordered by creation date (newest first)."""
    invoices = await invoice_service.get_all_invoices(limit=limit, offset=offset)
    return [
        InvoiceResponse(
            id=inv.id,
            filename=inv.filename,
            content_type=inv.content_type,
            storage_path=inv.storage_path,
            status=inv.status,
            extracted_text=inv.extracted_text,
            extracted_data=inv.extracted_data,
            created_at=inv.created_at,
            updated_at=inv.updated_at,
        )
        for inv in invoices
    ]


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    invoice_service: InvoiceService = Depends(get_invoice_service),
) -> InvoiceResponse:
    """Retrieve a single invoice by ID."""
    invoice = await invoice_service.get_invoice(invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")

    return InvoiceResponse(
        id=invoice.id,
        filename=invoice.filename,
        content_type=invoice.content_type,
        storage_path=invoice.storage_path,
        status=invoice.status,
        extracted_text=invoice.extracted_text,
        extracted_data=invoice.extracted_data,
        created_at=invoice.created_at,
        updated_at=invoice.updated_at,
    )


@router.get("/{invoice_id}/file")
async def get_invoice_file(
    invoice_id: int,
    invoice_service: InvoiceService = Depends(get_invoice_service),
):
    """Serve the original uploaded invoice file."""
    invoice = await invoice_service.get_invoice(invoice_id)
    if not invoice or not invoice.storage_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice file not found")

    file_path = Path(invoice.storage_path)
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File on disk not found")

    return FileResponse(path=file_path, media_type=invoice.content_type, filename=invoice.filename)


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_invoice(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Accept an invoice upload and return an acknowledgement payload."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    allowed_types = {"pdf", "png", "jpg", "jpeg"}
    file_extension = (file.filename or "").split(".")[-1].lower()
    if file_extension not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    return {
        "message": "Invoice upload accepted",
        "filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
    }
