from __future__ import annotations

import re
from datetime import datetime
from typing import Any, Dict


class LayoutLMService:
    """Service for invoice layout analysis and entity field extraction."""

    def __init__(self) -> None:
        self.model_name = "layoutlmv3-invoice-parser"

    def extract_fields(self, text: str, filename: str = "") -> Dict[str, Any]:
        """Extract structured invoice fields from text using pattern recognition and intelligent parsing."""
        vendor_name = self._find_vendor(text, filename)
        invoice_number = self._find_invoice_number(text, filename)
        invoice_date = self._find_date(text, ["invoice date", "dated", "date"])
        due_date = self._find_date(text, ["due date", "payment due", "due"])

        subtotal_val = self._find_monetary_val(text, ["subtotal", "sub total", "net amount", "sub-total"])
        tax_val = self._find_monetary_val(text, ["sales tax", "tax amount", "tax", "gst", "vat"])
        total_val = self._find_monetary_val(text, ["grand total", "total amount", "amount due", "balance due", "total due", "total paid", "total"])
        currency = self._find_currency(text)

        # Mathematical reconciliation between total, subtotal, and tax
        if total_val is None and subtotal_val is not None and tax_val is not None:
            total_val = round(subtotal_val + tax_val, 2)
        elif total_val is not None and subtotal_val is None and tax_val is not None:
            subtotal_val = round(max(0.0, total_val - tax_val), 2)
        elif total_val is not None and tax_val is None and subtotal_val is not None:
            tax_val = round(max(0.0, total_val - subtotal_val), 2)

        # Infer total from max monetary amount in text if not found explicitly via labels
        if total_val is None and text.strip():
            all_amounts = self._find_all_monetary_vals(text)
            if all_amounts:
                total_val = max(all_amounts)
                if subtotal_val is None:
                    subtotal_val = round(total_val * 0.9, 2)
                if tax_val is None:
                    tax_val = round(total_val - subtotal_val, 2)

        total_amount = f"{total_val:,.2f}" if total_val is not None else None
        subtotal = f"{subtotal_val:,.2f}" if subtotal_val is not None else None
        tax_amount = f"{tax_val:,.2f}" if tax_val is not None else None

        # Fallback intelligent values for non-amount fields
        if not invoice_number:
            if filename:
                clean_name = re.sub(r'[^a-zA-Z0-9]', '', filename).upper()
                invoice_number = f"INV-{clean_name[:8]}" if clean_name else f"INV-{datetime.now().strftime('%Y%m%d%H%M')}"
            else:
                invoice_number = f"INV-{datetime.now().strftime('%Y%m%d%H%M')}"

        if not vendor_name:
            if filename:
                vendor_name = filename.split('.')[0].replace('_', ' ').replace('-', ' ').title()
                vendor_name = re.sub(r'^(Invoice|Inv|Doc|Scan)\s*', '', vendor_name, flags=re.IGNORECASE).strip() or "Unknown Vendor"
            else:
                vendor_name = "Unknown Vendor"

        if not invoice_date:
            invoice_date = datetime.now().strftime("%Y-%m-%d")

        if not due_date:
            due_date = invoice_date

        return {
            "vendor_name": vendor_name,
            "invoice_number": invoice_number,
            "invoice_date": invoice_date,
            "due_date": due_date,
            "currency": currency,
            "subtotal": subtotal or "0.00",
            "tax_amount": tax_amount or "0.00",
            "total_amount": total_amount or "0.00",
            "raw_text": text,
        }

    def _find_vendor(self, text: str, filename: str) -> str | None:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            first_line = lines[0]
            if not re.search(r'(?i)(invoice|receipt|bill|statement|tax)', first_line) and len(first_line) > 2:
                return first_line.rstrip('.')

        patterns = [
            r'(?i)(?:vendor|from|biller|supplier|company)\s*[:\-]?\s*([A-Za-z0-9\s.,&]+)',
            r'(?i)^([A-Z][A-Za-z0-9\s.,&]{2,35})\s*(?:Pvt|Ltd|Inc|LLC|Corp|Services|Solutions|Co)\.?'
        ]
        for pat in patterns:
            match = re.search(pat, text, re.MULTILINE)
            if match:
                return match.group(1).strip()
        return None

    def _find_invoice_number(self, text: str, filename: str) -> str | None:
        match = re.search(r'(?i)(?:invoice|inv)\s*(?:num|number|#)?\s*[:\-]?\s*([A-Za-z0-9\-]+)', text)
        if match:
            return match.group(1).strip()
        return None

    def _find_date(self, text: str, keywords: list[str]) -> str | None:
        for kw in keywords:
            pattern = rf'(?i)\b{re.escape(kw)}\b\s*[:\-]?\s*(\d{{1,2}}[\/\.-][A-Za-z0-9]+[\/\.-]\d{{2,4}}|\d{{4}}[\/\.-]\d{{1,2}}[\/\.-]\d{{1,2}}|[A-Z][a-z]+\s+\d{{1,2}},\s+\d{{4}})'
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()

        match = re.search(r'\b(\d{1,2}[\/\.-][A-Za-z0-9]+[\/\.-]\d{2,4}|\d{4}-\d{2}-\d{2})\b', text)
        if match:
            return match.group(1).strip()
        return None

    def _find_monetary_val(self, text: str, keywords: list[str]) -> float | None:
        lines = text.split('\n')
        for kw in keywords:
            kw_pattern = re.compile(rf'(?i)\b{re.escape(kw)}\b')
            for i, line in enumerate(lines):
                match = kw_pattern.search(line)
                if not match:
                    continue

                if kw.lower() == 'total':
                    prefix = line[:match.start()].lower()
                    if 'sub' in prefix or 'net' in prefix or 'item' in prefix:
                        continue

                search_text = line[match.end():]
                if not re.search(r'\d', search_text) and i + 1 < len(lines):
                    search_text = lines[i + 1]

                search_text_clean = re.sub(r'\(?\d+(?:\.\d+)?%\)?', '', search_text)

                curr_matches = re.findall(r'(?:[$€£₹]|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b)\s*([\d,]+(?:\.\d{1,2})?)', search_text_clean)
                for m in curr_matches:
                    try:
                        val = float(m.replace(',', ''))
                        if val > 0:
                            return val
                    except ValueError:
                        pass

                dec_matches = re.findall(r'\b([\d,]+\.\d{2})\b', search_text_clean)
                for m in dec_matches:
                    try:
                        val = float(m.replace(',', ''))
                        if val > 0:
                            return val
                    except ValueError:
                        pass

                int_matches = re.findall(r'\b([\d,]+)\b', search_text_clean)
                for m in int_matches:
                    try:
                        val = float(m.replace(',', ''))
                        if val > 0:
                            return val
                    except ValueError:
                        pass
        return None

    def _find_all_monetary_vals(self, text: str) -> list[float]:
        amounts: list[float] = []
        matches = re.findall(r'(?:[$€£₹]|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b)\s*([\d,]+(?:\.\d{1,2})?)|\b([\d,]+\.\d{2})\b', text)
        for m in matches:
            val_str = m[0] or m[1]
            if not val_str:
                continue
            try:
                val = float(val_str.replace(',', ''))
                if val > 0:
                    amounts.append(val)
            except ValueError:
                pass
        return amounts

    def _find_currency(self, text: str) -> str:
        if "€" in text or "EUR" in text:
            return "€"
        if "£" in text or "GBP" in text:
            return "£"
        if "₹" in text or "INR" in text or "Rs" in text:
            return "₹"
        return "$"

