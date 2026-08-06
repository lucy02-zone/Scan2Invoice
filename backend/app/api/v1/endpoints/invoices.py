from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db

router = APIRouter()


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_invoice(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Accept an invoice upload and return an acknowledgement payload."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    allowed_types = {"pdf", "png", "jpg", "jpeg"}
    file_extension = (file.filename or "").split(".")[-1].lower()
    if file_extension not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    return {
        "message": "Invoice upload accepted",
        "filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
    }
