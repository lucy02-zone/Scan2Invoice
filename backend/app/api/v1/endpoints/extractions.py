from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.repositories.extracted_invoice import ExtractedInvoiceRepository
from app.schemas.extracted_invoice import ExtractedInvoiceCreate, ExtractedInvoiceResponse
from app.services.extraction_service import ExtractionService

router = APIRouter()


def get_extraction_service(session: AsyncSession = Depends(get_db)) -> ExtractionService:
    """Create an extraction service from an injected database session."""
    repository = ExtractedInvoiceRepository(session)
    return ExtractionService(repository)


@router.post("", response_model=ExtractedInvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_extraction(
    payload: ExtractedInvoiceCreate,
    extraction_service: ExtractionService = Depends(get_extraction_service),
) -> ExtractedInvoiceResponse:
    """Create a new extracted invoice record."""
    extraction = await extraction_service.create_extraction(payload)
    return ExtractedInvoiceResponse(
        id=extraction.id,
        invoice_id=extraction.invoice_id,
        vendor_name=extraction.vendor_name,
        invoice_number=extraction.invoice_number,
        invoice_date=extraction.invoice_date,
        due_date=extraction.due_date,
        currency=extraction.currency,
        subtotal=extraction.subtotal,
        tax_amount=extraction.tax_amount,
        total_amount=extraction.total_amount,
        raw_json=extraction.raw_json,
        created_at=extraction.created_at,
        updated_at=extraction.updated_at,
    )


@router.get("", response_model=List[ExtractedInvoiceResponse])
async def list_extractions(
    limit: int = 100,
    offset: int = 0,
    extraction_service: ExtractionService = Depends(get_extraction_service),
) -> List[ExtractedInvoiceResponse]:
    """Retrieve all extracted invoice records."""
    extractions = await extraction_service.get_all_extractions(limit=limit, offset=offset)
    return [
        ExtractedInvoiceResponse(
            id=ext.id,
            invoice_id=ext.invoice_id,
            vendor_name=ext.vendor_name,
            invoice_number=ext.invoice_number,
            invoice_date=ext.invoice_date,
            due_date=ext.due_date,
            currency=ext.currency,
            subtotal=ext.subtotal,
            tax_amount=ext.tax_amount,
            total_amount=ext.total_amount,
            raw_json=ext.raw_json,
            created_at=ext.created_at,
            updated_at=ext.updated_at,
        )
        for ext in extractions
    ]


@router.get("/{invoice_id}", response_model=ExtractedInvoiceResponse)
async def get_extraction(
    invoice_id: int,
    extraction_service: ExtractionService = Depends(get_extraction_service),
) -> ExtractedInvoiceResponse:
    """Retrieve extracted invoice data for a specific invoice."""
    extraction = await extraction_service.get_by_invoice_id(invoice_id)
    if not extraction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Extraction not found")

    return ExtractedInvoiceResponse(
        id=extraction.id,
        invoice_id=extraction.invoice_id,
        vendor_name=extraction.vendor_name,
        invoice_number=extraction.invoice_number,
        invoice_date=extraction.invoice_date,
        due_date=extraction.due_date,
        currency=extraction.currency,
        subtotal=extraction.subtotal,
        tax_amount=extraction.tax_amount,
        total_amount=extraction.total_amount,
        raw_json=extraction.raw_json,
        created_at=extraction.created_at,
        updated_at=extraction.updated_at,
    )
