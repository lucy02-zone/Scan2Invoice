from __future__ import annotations

from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.invoice import Invoice


class ExtractedInvoice(Base):
    """Stores structured invoice data extracted from an uploaded document."""

    __tablename__ = "extracted_invoices"

    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id"), nullable=False, unique=True, index=True)
    vendor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    invoice_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    invoice_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    due_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    currency: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    subtotal: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    tax_amount: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    total_amount: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    raw_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    invoice: Mapped[Invoice] = relationship("Invoice")
