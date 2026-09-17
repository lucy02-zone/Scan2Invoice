import os
import tempfile
import unittest
from PIL import Image, ImageDraw

from app.services.layoutlm_service import LayoutLMService
from app.services.ocr_service import OCRService


class ExtractionServiceTests(unittest.TestCase):
    def setUp(self):
        self.layout_service = LayoutLMService()
        self.ocr_service = OCRService()

    def test_layout_extraction_with_explicit_total(self):
        text = """
        ACME Logistics Inc.
        Invoice #: INV-9988
        Invoice Date: 2026-03-15
        Due Date: 2026-04-15

        Shipping Fee: $350.00
        Handling: $50.00

        Subtotal: $400.00
        Sales Tax: $40.00
        Grand Total: $440.00
        """
        res = self.layout_service.extract_fields(text, filename="Invoice_ACME.pdf")
        self.assertEqual(res["vendor_name"], "ACME Logistics Inc")
        self.assertEqual(res["invoice_number"], "INV-9988")
        self.assertEqual(res["total_amount"], "440.00")
        self.assertEqual(res["subtotal"], "400.00")
        self.assertEqual(res["tax_amount"], "40.00")

    def test_layout_extraction_without_1450_default(self):
        text = "Random document text without any monetary values or invoice tables."
        res = self.layout_service.extract_fields(text, filename="doc.pdf")
        # Ensure total_amount is NOT the old hardcoded default "1,450.00"
        self.assertNotEqual(res["total_amount"], "1,450.00")
        self.assertEqual(res["total_amount"], "0.00")

    def test_image_ocr_and_extraction_pipeline(self):
        # Create a synthetic image invoice with $620.00 total
        img = Image.new("RGB", (600, 400), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        draw.text((30, 30), "TechCorp Solutions", fill=(0, 0, 0))
        draw.text((30, 60), "Invoice #: INV-7711", fill=(0, 0, 0))
        draw.text((30, 90), "Subtotal: $550.00", fill=(0, 0, 0))
        draw.text((30, 120), "Tax: $70.00", fill=(0, 0, 0))
        draw.text((30, 150), "Total: $620.00", fill=(0, 0, 0))

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            img_path = tmp.name
            img.save(img_path)

        try:
            extracted_text = self.ocr_service.extract_text(img_path)
            self.assertTrue(len(extracted_text) > 0)
            res = self.layout_service.extract_fields(extracted_text, filename="test_invoice.png")
            self.assertNotEqual(res["total_amount"], "1,450.00")
        finally:
            if os.path.exists(img_path):
                os.remove(img_path)


if __name__ == "__main__":
    unittest.main()
