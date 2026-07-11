"""
Thin async client around the Fireworks AI chat-completions endpoint.

Fireworks exposes an OpenAI-compatible /chat/completions API, so we speak
that wire format directly over httpx rather than pulling in an extra SDK.
"""
import json
import logging
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception

from config import get_settings

logger = logging.getLogger("crisismind.fireworks")


def _is_transient_error(exception: Exception) -> bool:
    if isinstance(exception, httpx.HTTPStatusError):
        # Do not retry on 4xx client errors, except 429 Too Many Requests
        return exception.response.status_code == 429 or exception.response.status_code >= 500
    # Retry on network/timeout issues
    return isinstance(exception, (httpx.NetworkError, httpx.TimeoutException))


class FireworksClient:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._disabled = False

    @property
    def _configured(self) -> bool:
        is_placeholder = self.settings.FIREWORKS_API_KEY.startswith("fw_LECd7u16mY")
        return bool(self.settings.FIREWORKS_API_KEY) and not is_placeholder and not self._disabled

    @retry(
        retry=retry_if_exception(_is_transient_error),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
    )
    async def _call(self, messages: list[dict[str, str]], temperature: float = 0.3) -> str:
        headers = {
            "Authorization": f"Bearer {self.settings.FIREWORKS_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.FIREWORKS_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 4096,
        }
        async with httpx.AsyncClient(timeout=90.0) as client:
            resp = await client.post(
                f"{self.settings.FIREWORKS_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def structured_call(
        self, system_prompt: str, user_prompt: str, fallback: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Calls the LLM expecting a strict-JSON response. Falls back to a
        deterministic mock payload if no API key is configured, or if the
        model/network call fails, so the pipeline is always demoable.
        """
        if not self._configured:
            logger.info("FIREWORKS_API_KEY not set or disabled - using mock response")
            return fallback

        try:
            raw = await self._call(
                [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ]
            )
            raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            try:
                return json.loads(raw)
            except json.JSONDecodeError as decode_exc:
                logger.warning("JSON parsing failed. Raw response was: %r", raw)
                raise decode_exc
        except Exception as exc:  # noqa: BLE001
            if isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code in (401, 403, 404):
                logger.warning(
                    "Fireworks API returned status %d. Disabling Fireworks client and falling back to mocks for this session.",
                    exc.response.status_code,
                )
                self._disabled = True
            else:
                logger.warning("Fireworks call failed (%s) - falling back to mock", exc)
            return fallback


fireworks_client = FireworksClient()

