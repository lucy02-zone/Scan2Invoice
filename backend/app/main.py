from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logger import app_logger

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)

app.include_router(api_router)


@app.on_event("startup")
async def startup_event():
    app_logger.info("Scan2Invoice backend started")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Scan2Invoice API",
        "version": settings.VERSION,
    }
