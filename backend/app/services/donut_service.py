from __future__ import annotations

from typing import Any, Dict


class DonutService:
    """Service scaffold for Donut-based document understanding."""

    def __init__(self) -> None:
        self.model_name = "donut"

    def extract(self, text: str) -> Dict[str, Any]:
        """Return a placeholder structured result for Donut-style extraction."""
        return {
            "document_type": "invoice",
            "raw_text": text,
        }
