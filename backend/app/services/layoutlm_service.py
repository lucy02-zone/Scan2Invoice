from __future__ import annotations

from typing import Any, Dict


class LayoutLMService:
    """Service scaffold for LayoutLM-based invoice field extraction."""

    def __init__(self) -> None:
        self.model_name = "layoutlmv3"

    def extract_fields(self, text: str) -> Dict[str, Any]:
        """Produce a structured placeholder field extraction result."""
        return {
            "vendor_name": None,
            "invoice_number": None,
            "invoice_date": None,
            "due_date": None,
            "currency": None,
            "subtotal": None,
            "tax_amount": None,
            "total_amount": None,
            "raw_text": text,
        }
