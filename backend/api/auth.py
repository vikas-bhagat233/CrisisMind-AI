"""
Minimal stub auth for the MVP. Swap for real Supabase Auth / JWT
verification before shipping to production - kept intentionally simple so
the rest of the app has a stable dependency to build against.
"""
from fastapi import APIRouter, Header, HTTPException

router = APIRouter(tags=["auth"])


@router.get("/auth/me")
async def me(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="missing Authorization header")
    return {"user_id": "demo-user", "authenticated": True}
