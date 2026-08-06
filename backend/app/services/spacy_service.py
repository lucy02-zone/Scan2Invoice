from __future__ import annotations

from typing import Any, Dict


class SpacyService:
    """Service scaffold for spaCy-based entity extraction."""

    def __init__(self) -> None:
        self.model_name = "en_core_web_sm"

    def extract_entities(self, text: str) -> Dict[str, Any]:
        """Return a placeholder result for spaCy entity extraction."""
        return {
            "entities": [],
            "raw_text": text,
        }
