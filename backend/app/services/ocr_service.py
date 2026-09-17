from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Optional
import pypdf
import pdfplumber

logger = logging.getLogger(__name__)


class OCRService:
    """Service for OCR and text extraction from invoice documents."""

    def __init__(self, tesseract_cmd: Optional[str] = None) -> None:
        self.tesseract_cmd = tesseract_cmd
        self._rapidocr_engine: Any = None

    def _get_rapidocr(self) -> Any:
        if self._rapidocr_engine is None:
            try:
                from rapidocr_onnxruntime import RapidOCR
                self._rapidocr_engine = RapidOCR()
            except Exception as e:
                logger.warning(f"Could not initialize RapidOCR: {e}")
                self._rapidocr_engine = False
        return self._rapidocr_engine if self._rapidocr_engine is not False else None

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
        """Extract text from PDF using pypdf, pdfplumber, and RapidOCR fallback for scanned pages."""
        extracted_text = ""
        try:
            with open(file_path, "rb") as f:
                reader = pypdf.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception as e:
            logger.debug(f"pypdf extraction failed for {file_path}: {e}")

        if not extracted_text.strip():
            try:
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text = page.extract_text()
                        if text:
                            extracted_text += text + "\n"
            except Exception as e:
                logger.debug(f"pdfplumber extraction failed for {file_path}: {e}")

        if not extracted_text.strip():
            extracted_text = self._extract_scanned_pdf(file_path)

        return extracted_text.strip()

    def _extract_scanned_pdf(self, file_path: Path) -> str:
        """Extract text from scanned PDF by rendering pages to images and using OCR."""
        text_lines = []
        try:
            import pypdfium2
            pdf = pypdfium2.PdfDocument(file_path)
            for page in pdf:
                image = page.render(scale=2).to_pil()
                ocr_text = self._ocr_pil_image(image)
                if ocr_text:
                    text_lines.append(ocr_text)
        except Exception as e:
            logger.warning(f"Scanned PDF OCR failed for {file_path}: {e}")

        return "\n".join(text_lines)

    def _extract_from_image(self, file_path: Path) -> str:
        """Extract text from raster images using RapidOCR or pytesseract with image preprocessing."""
        try:
            from PIL import Image, ImageOps

            image = Image.open(file_path)
            image = ImageOps.exif_transpose(image)
            if image.mode != "RGB":
                image = image.convert("RGB")

            # Scale up small images for better OCR detection
            w, h = image.size
            if w < 1000 or h < 1000:
                factor = max(1000.0 / max(w, 1), 1000.0 / max(h, 1))
                new_size = (int(w * factor), int(h * factor))
                image = image.resize(new_size, Image.Resampling.LANCZOS)

            ocr_text = self._ocr_pil_image(image)
            if ocr_text:
                return ocr_text
        except Exception as e:
            logger.warning(f"PIL image preprocessing failed for {file_path}: {e}")

        # Fallback direct path OCR
        rapidocr = self._get_rapidocr()
        if rapidocr:
            try:
                result, _ = rapidocr(str(file_path))
                if result:
                    lines = [item[1] for item in result if item and len(item) > 1 and item[1]]
                    text = "\n".join(lines).strip()
                    if text:
                        return text
            except Exception as e:
                logger.warning(f"RapidOCR direct image extraction failed for {file_path}: {e}")

        try:
            import pytesseract
            from PIL import Image

            if self.tesseract_cmd:
                pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd

            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            if text.strip():
                return text.strip()
        except Exception as e:
            logger.debug(f"Pytesseract failed for {file_path}: {e}")

        return ""

    def _ocr_pil_image(self, image: Any) -> str:
        """Helper to run OCR on a PIL image object."""
        rapidocr = self._get_rapidocr()
        if rapidocr:
            try:
                import numpy as np
                img_array = np.array(image.convert("RGB"))
                result, _ = rapidocr(img_array)
                if result:
                    lines = [item[1] for item in result if item and len(item) > 1 and item[1]]
                    text = "\n".join(lines).strip()
                    if text:
                        return text
            except Exception as e:
                logger.warning(f"RapidOCR PIL image OCR failed: {e}")

        try:
            import pytesseract
            text = pytesseract.image_to_string(image)
            if text.strip():
                return text.strip()
        except Exception:
            pass

        return ""

    def build_result(self, file_path: str | Path, extracted_text: str) -> Dict[str, Any]:
        """Build a normalized OCR result payload."""
        return {
            "file_name": Path(file_path).name,
            "extracted_text": extracted_text,
        }

