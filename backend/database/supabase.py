"""
Supabase client wiring. Uses the service-role key from settings so the
backend can read/write the reports table directly.
"""
import logging
from functools import lru_cache

from supabase import create_client, Client

from config import get_settings

logger = logging.getLogger("crisismind.supabase")


@lru_cache
def get_client() -> Client | None: # type: ignore
    settings = get_settings()
    if (
        not settings.SUPABASE_URL
        or not settings.SUPABASE_SERVICE_KEY
        or settings.SUPABASE_SERVICE_KEY.startswith("sb_secret_")
    ):
        logger.info("Supabase not configured - running with in-memory storage only")
        return None
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    except Exception as exc:
        logger.warning("Supabase client disabled due to invalid configuration: %s", exc)
        return None
