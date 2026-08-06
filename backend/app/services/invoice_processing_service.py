from __future__ import annotations

from typing import Any, Dict

from app.schemas.extracted_invoice import ExtractedInvoiceCreate
from app.services.donut_service import DonutService
from app.services.layoutlm_service import LayoutLMService
from app.services.ocr_service import OCRService
from app.services.spacy_service import SpacyService


class InvoiceProcessingService:
    """Orchestrates OCR, layout analysis, and entity extraction for invoice processing."""

    def __init__(self) -> None:
        self.ocr_service = OCRService()
        self.layoutlm_service = LayoutLMService()
        self.donut_service = DonutService()
        self.spacy_service = SpacyService()

    def process(self, file_path: str) -> Dict[str, Any]:
        """Run processing pipeline over an invoice file."""
        filename = Path(file_path).name
        extracted_text = self.ocr_service.extract_text(file_path)
        layout_fields = self.layoutlm_service.extract_fields(extracted_text, filename=filename)
        donut_result = self.donut_service.extract(extracted_text)
        spacy_result = self.spacy_service.extract_entities(extracted_text)

        return {
            "ocr_text": extracted_text,
            "layout_fields": layout_fields,
            "donut_result": donut_result,
            "spacy_result": spacy_result,
        }

    def to_extraction_payload(self, file_path: str, invoice_id: int) -> ExtractedInvoiceCreate:
        """Convert the processing output into an extracted invoice create payload."""
        processing_result = self.process(file_path)
        layout_fields = processing_result["layout_fields"]

        return ExtractedInvoiceCreate(
            invoice_id=invoice_id,
            vendor_name=layout_fields.get("vendor_name"),
            invoice_number=layout_fields.get("invoice_number"),
            invoice_date=layout_fields.get("invoice_date"),
            due_date=layout_fields.get("due_date"),
            currency=layout_fields.get("currency"),
            subtotal=layout_fields.get("subtotal"),
            tax_amount=layout_fields.get("tax_amount"),
            total_amount=layout_fields.get("total_amount"),
            raw_json=str(processing_result),
        )
