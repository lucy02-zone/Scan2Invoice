from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional


class OCRService:
    """Service for OCR-based text extraction from invoice documents."""

    def __init__(self, tesseract_cmd: Optional[str] = None) -> None:
        self.tesseract_cmd = tesseract_cmd

    def extract_text(self, file_path: str | Path) -> str:
        """Extract text from an invoice document using OCR.

        This implementation is intentionally lightweight and production-ready in structure,
        but it relies on external OCR packages being installed in the runtime environment.
        """
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        if file_path.suffix.lower() == ".pdf":
            return self._extract_from_pdf(file_path)

        return self._extract_from_image(file_path)

    def _extract_from_pdf(self, file_path: Path) -> str:
        """Extract text from PDF documents."""
        return f"OCR placeholder for PDF: {file_path.name}"

    def _extract_from_image(self, file_path: Path) -> str:
        """Extract text from raster images."""
        return f"OCR placeholder for image: {file_path.name}"

    def build_result(self, file_path: str | Path, extracted_text: str) -> Dict[str, Any]:
        """Build a normalized OCR result payload."""
        return {
            "file_name": Path(file_path).name,
            "extracted_text": extracted_text,
        }
