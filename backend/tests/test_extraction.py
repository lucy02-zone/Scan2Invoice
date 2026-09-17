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


    def test_brightwave_and_scan2invoice_formats(self):
        text1 = """
        INVOICE
        BrightWave Digital Services
        78 MG Road, Chennai, Tamil Nadu
        GSTIN: 33AAFCB5678L1Z2

        Invoice No: BW-2026-104
        Invoice Date: 14-Aug-2026
        Due Date: 13-Sep-2026

        Subtotal ■53,000.00
        GST (18%) ■9,540.00
        Total Amount Due ■62,540.00
        """
        res1 = self.layout_service.extract_fields(text1, filename="brightwave.pdf")
        self.assertEqual(res1["vendor_name"], "BrightWave Digital Services")
        self.assertEqual(res1["invoice_number"], "BW-2026-104")
        self.assertEqual(res1["total_amount"], "62,540.00")
        self.assertEqual(res1["subtotal"], "53,000.00")

        text2 = """
        INVOICE
        Scan2Invoice Solutions
        123 Tech Park, Hyderabad, Telangana

        Invoice No: INV-2026-001
        Invoice Date: 14-Aug-2026

        Subtotal ■35,000.00
        GST (18%) ■6,300.00
        Total ■41,300.00
        """
        res2 = self.layout_service.extract_fields(text2, filename="scan2invoice.pdf")
        self.assertEqual(res2["vendor_name"], "Scan2Invoice Solutions")
        self.assertEqual(res2["invoice_number"], "INV-2026-001")
        self.assertEqual(res2["total_amount"], "41,300.00")

    def test_same_line_subtotal_and_total(self):
        text = "Subtotal: $100.00    Sales Tax: $10.00    Total: $110.00"
        res = self.layout_service.extract_fields(text, filename="sameline.pdf")
        self.assertEqual(res["subtotal"], "100.00")
        self.assertEqual(res["tax_amount"], "10.00")
        self.assertEqual(res["total_amount"], "110.00")

    def test_multi_line_total_and_suffix_currency(self):
        text = """
        Apex Enterprise
        Invoice Date: September 20, 2026
        TOTAL
        AMOUNT DUE
        1,540.50 EUR
        """
        res = self.layout_service.extract_fields(text, filename="apex.pdf")
        self.assertEqual(res["currency"], "€")
        self.assertEqual(res["total_amount"], "1,540.50")
        self.assertEqual(res["invoice_date"], "September 20, 2026")

    def test_real_uploaded_png_images(self):
        img_path = "uploads/5_resource.png"
        if os.path.exists(img_path):
            text = self.ocr_service.extract_text(img_path)
            res = self.layout_service.extract_fields(text, filename=img_path)
            self.assertEqual(res["vendor_name"], "East Repair Inc")
            self.assertEqual(res["invoice_number"], "US-001")
            self.assertEqual(res["total_amount"], "154.06")
            self.assertEqual(res["subtotal"], "145.00")
            self.assertEqual(res["tax_amount"], "9.06")


if __name__ == "__main__":
    unittest.main()

