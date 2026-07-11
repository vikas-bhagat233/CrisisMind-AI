"""Aggregates all API sub-routers under a single include point."""
from fastapi import APIRouter

from api import auth, health, reports, websocket

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(reports.router)
api_router.include_router(websocket.router)
