import sys
from pathlib import Path

# Ensure backend root directory is in sys.path for app module resolution
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logger import app_logger
from app.db.session import init_db

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)

# Enable CORS to allow browser-based frontends to call the API (dev-friendly).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reduce SQL logging noise in development: SQLAlchemy prints BEGIN/ROLLBACK
# for read-only request cleanup. Raise its level to WARNING to avoid
# confusing ROLLBACK messages when requests complete normally.
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

app.include_router(api_router)


@app.on_event("startup")
async def startup_event():
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    await init_db()
    app_logger.info("Scan2Invoice backend started")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Scan2Invoice API",
        "version": settings.VERSION,
    }