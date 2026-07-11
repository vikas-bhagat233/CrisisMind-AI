"""
Free, keyless geocoding via the Open-Meteo geocoding API - resolves a place
name to coordinates so we can fetch weather and plot the crisis map.
"""
import logging

import httpx

logger = logging.getLogger("crisismind.geocoder")

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"


async def geocode(place_name: str) -> dict | None:
    if not place_name or place_name.lower() == "unspecified":
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(GEOCODE_URL, params={"name": place_name, "count": 1})
            resp.raise_for_status()
            results = resp.json().get("results") or []
            if not results:
                return None
            top = results[0]
            return {
                "name": top.get("name"),
                "country": top.get("country"),
                "latitude": top.get("latitude"),
                "longitude": top.get("longitude"),
            }
    except Exception as exc:  # noqa: BLE001
        logger.warning("Geocoding failed for %s (%s)", place_name, exc)
        return None
