from __future__ import annotations

from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.dependencies import get_db
from app.repositories.extracted_invoice import ExtractedInvoiceRepository
from app.repositories.invoice import InvoiceRepository
from app.schemas.invoice import InvoiceCreate
from app.services.extraction_service import ExtractionService
from app.services.invoice_processing_service import InvoiceProcessingService
from app.services.invoice_service import InvoiceService

router = APIRouter()


def get_processing_dependencies(session: AsyncSession = Depends(get_db)) -> tuple[InvoiceService, ExtractionService, InvoiceProcessingService]:
    """Create processing dependencies from injected database services."""
    invoice_repository = InvoiceRepository(session)
    extracted_repository = ExtractedInvoiceRepository(session)
    invoice_service = InvoiceService(invoice_repository)
    extraction_service = ExtractionService(extracted_repository)
    processing_service = InvoiceProcessingService()
    return invoice_service, extraction_service, processing_service


@router.post("/process", status_code=status.HTTP_202_ACCEPTED)
async def process_invoice(
    file: UploadFile = File(...),
    dependencies: tuple[InvoiceService, ExtractionService, InvoiceProcessingService] = Depends(get_processing_dependencies),
) -> dict[str, str]:
    """Process an uploaded invoice and create extraction results."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    invoice_service, extraction_service, processing_service = dependencies

    invoice = await invoice_service.create_invoice(
        InvoiceCreate(
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            status="uploaded",
        )
    )

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = Path(file.filename).name
    storage_path = upload_dir / f"{invoice.id}_{safe_filename}"

    await file.seek(0)
    async with aiofiles.open(storage_path, "wb") as handle:
        while chunk := await file.read(1024 * 1024):
            await handle.write(chunk)

    invoice.storage_path = str(storage_path)
    await invoice_service.mark_processing(invoice)

    processing_result = processing_service.process(str(storage_path))
    extraction_payload = processing_service.to_extraction_payload(str(storage_path), invoice.id)
    extraction = await extraction_service.create_extraction(extraction_payload)
    await invoice_service.mark_completed(
        invoice,
        extracted_text=processing_result.get("ocr_text", "processed"),
        extracted_data=extraction_payload.raw_json or "{}",
    )

    return {
        "message": "Invoice processing completed",
        "invoice_id": str(invoice.id),
        "extraction_id": str(extraction.id),
    }
