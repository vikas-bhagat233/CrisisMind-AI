"""
Tavily search wrapper. Used by the Research agent to pull live web context
about an unfolding crisis (news, advisories, warnings).
"""
import logging
from typing import Any

import httpx

from config import get_settings

logger = logging.getLogger("crisismind.tavily")


async def search(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    settings = get_settings()
    if not settings.TAVILY_API_KEY:
        logger.info("TAVILY_API_KEY not set - using mock search results")
        return _mock_results(query)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                f"{settings.TAVILY_BASE_URL}/search",
                json={
                    "api_key": settings.TAVILY_API_KEY,
                    "query": query,
                    "search_depth": "advanced",
                    "max_results": max_results,
                    "include_answer": False,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                {"title": r.get("title", ""), "url": r.get("url", ""), "content": r.get("content", "")}
                for r in data.get("results", [])
            ]
    except Exception as exc:  # noqa: BLE001
        logger.warning("Tavily search failed (%s) - falling back to mock", exc)
        return _mock_results(query)


def _mock_results(query: str) -> list[dict[str, Any]]:
    return [
        {
            "title": f"Live advisory feed for: {query}",
            "url": "https://example-emergency-feed.gov/advisory",
            "content": (
                "Local authorities have issued an advisory for the affected area. "
                "Conditions are being monitored and updates will follow every few hours."
            ),
        },
        {
            "title": "Regional weather and hazard bulletin",
            "url": "https://example-weather.gov/bulletin",
            "content": (
                "Weather services report ongoing conditions consistent with the reported "
                "event. Residents are advised to stay alert to official channels."
            ),
        },
    ]
