from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class InvoiceBase(BaseModel):
    """Shared invoice schema fields."""

    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=1, max_length=100)
    status: str = "uploaded"


class InvoiceCreate(InvoiceBase):
    """Schema for creating a new invoice record."""

    storage_path: Optional[str] = Field(default=None, max_length=500)
    extracted_text: Optional[str] = None
    extracted_data: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    """Schema for returning invoice data through the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    storage_path: Optional[str] = None
    extracted_text: Optional[str] = None
    extracted_data: Optional[str] = None
    created_at: datetime
    updated_at: datetime
