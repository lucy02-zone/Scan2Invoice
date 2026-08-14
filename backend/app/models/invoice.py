from __future__ import annotations

from enum import Enum
from typing import Optional

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class InvoiceStatus(str, Enum):
    """Lifecycle status of an invoice extraction workflow."""

    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Invoice(Base):
    """Represents an uploaded invoice document and its extraction state."""

    __tablename__ = "invoices"

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    storage_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=InvoiceStatus.UPLOADED.value, nullable=False)
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    extracted_data: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
