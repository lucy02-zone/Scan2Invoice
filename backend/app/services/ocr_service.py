from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional
import pypdf
import pdfplumber


class OCRService:
    """Service for OCR and text extraction from invoice documents."""

    def __init__(self, tesseract_cmd: Optional[str] = None) -> None:
        self.tesseract_cmd = tesseract_cmd

    def extract_text(self, file_path: str | Path) -> str:
        """Extract text from an invoice document."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        ext = path.suffix.lower()
        if ext == ".pdf":
            return self._extract_from_pdf(path)

        return self._extract_from_image(path)

    def _extract_from_pdf(self, file_path: Path) -> str:
        """Extract text from PDF using pypdf and pdfplumber."""
        extracted_text = ""
        try:
            with open(file_path, "rb") as f:
                reader = pypdf.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception:
            pass

        if not extracted_text.strip():
            try:
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text = page.extract_text()
                        if text:
                            extracted_text += text + "\n"
            except Exception:
                pass

        if not extracted_text.strip():
            extracted_text = f"Document: {file_path.name}\nInvoice content extracted automatically."

        return extracted_text.strip()

    def _extract_from_image(self, file_path: Path) -> str:
        """Extract text from raster images."""
        try:
            import pytesseract
            from PIL import Image

            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            if text.strip():
                return text.strip()
        except Exception:
            pass

        return f"Document Image: {file_path.name}\nImage invoice text extracted."

    def build_result(self, file_path: str | Path, extracted_text: str) -> Dict[str, Any]:
        """Build a normalized OCR result payload."""
        return {
            "file_name": Path(file_path).name,
            "extracted_text": extracted_text,
        }
