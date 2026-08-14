#!/usr/bin/env bash
# Render deployment start script
# Runs FastAPI backend from the repo root without needing Root Directory = backend

set -e

export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

cd backend
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
