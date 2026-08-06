from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.extractions import router as extractions_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.invoices import router as invoices_router
from app.api.v1.endpoints.process import router as process_router

api_router = APIRouter()

api_router.include_router(
    health_router,
    tags=["Health"],
)

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    invoices_router,
    prefix="/invoices",
    tags=["Invoices"],
)

api_router.include_router(
    extractions_router,
    prefix="/extractions",
    tags=["Extractions"],
)

api_router.include_router(
    process_router,
    tags=["Processing"],
)