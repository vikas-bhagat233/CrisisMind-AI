"""
CRUD helpers for the reports table. Falls back to an in-process list when
Supabase isn't configured, so History/Dashboard still work in local/demo
mode without any external service.
"""
import logging
import uuid
from datetime import datetime, timezone

from config import get_settings
from database.supabase import get_client

logger = logging.getLogger("crisismind.crud")

_IN_MEMORY_REPORTS: list[dict] = []


def save_report(report: dict) -> dict:
    settings = get_settings()
    report = dict(report)
    report["id"] = report.get("id") or str(uuid.uuid4())
    report["created_at"] = report.get("created_at") or datetime.now(timezone.utc).isoformat()

    client = get_client()
    if client is None:
        _IN_MEMORY_REPORTS.insert(0, report)
        return report

    try:
        client.table(settings.SUPABASE_REPORTS_TABLE).insert(
            {
                "id": report["id"],
                "created_at": report["created_at"],
                "query": report["query"],
                "crisis_type": report["crisis_type"],
                "location": report["location"],
                "payload": report,
            }
        ).execute()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Supabase insert failed (%s) - keeping in-memory copy only", exc)
        _IN_MEMORY_REPORTS.insert(0, report)
    return report


def list_reports(limit: int = 50) -> list[dict]:
    client = get_client()
    if client is None:
        return _IN_MEMORY_REPORTS[:limit]

    settings = get_settings()
    try:
        res = (
            client.table(settings.SUPABASE_REPORTS_TABLE)
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return [row["payload"] for row in res.data]
    except Exception as exc:  # noqa: BLE001
        logger.warning("Supabase read failed (%s) - using in-memory copy", exc)
        return _IN_MEMORY_REPORTS[:limit]


def get_report(report_id: str) -> dict | None:
    client = get_client()
    if client is None:
        return next((r for r in _IN_MEMORY_REPORTS if r["id"] == report_id), None)

    settings = get_settings()
    try:
        res = (
            client.table(settings.SUPABASE_REPORTS_TABLE)
            .select("*")
            .eq("id", report_id)
            .single()
            .execute()
        )
        return res.data["payload"] if res.data else None
    except Exception as exc:  # noqa: BLE001
        exc_str = str(exc)
        if "PGRST116" in exc_str or "contains 0 rows" in exc_str:
            logger.info("Report %s not found in Supabase database", report_id)
        else:
            logger.warning("Supabase lookup failed (%s)", exc)
        return next((r for r in _IN_MEMORY_REPORTS if r["id"] == report_id), None)
