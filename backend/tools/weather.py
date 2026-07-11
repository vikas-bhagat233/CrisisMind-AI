"""
Free, keyless live weather via Open-Meteo - gives the Research agent real
ground-truth conditions to reason about for weather-driven crises.
"""
import logging

import httpx

logger = logging.getLogger("crisismind.weather")

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


async def current_conditions(latitude: float, longitude: float) -> dict | None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                FORECAST_URL,
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": "temperature_2m,precipitation,wind_speed_10m,weather_code",
                },
            )
            resp.raise_for_status()
            return resp.json().get("current")
    except Exception as exc:  # noqa: BLE001
        logger.warning("Weather fetch failed (%s)", exc)
        return None
