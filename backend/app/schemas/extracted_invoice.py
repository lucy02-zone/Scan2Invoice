from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ExtractedInvoiceBase(BaseModel):
    """Shared extracted invoice schema fields."""

    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    currency: Optional[str] = None
    subtotal: Optional[str] = None
    tax_amount: Optional[str] = None
    total_amount: Optional[str] = None
    raw_json: Optional[str] = None


class ExtractedInvoiceCreate(ExtractedInvoiceBase):
    """Schema for creating extracted invoice data."""

    invoice_id: int


class ExtractedInvoiceResponse(ExtractedInvoiceBase):
    """Schema for returning extracted invoice data through the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_id: int
    created_at: datetime
    updated_at: datetime
