"""
Central app configuration.
Reads from environment variables (.env). Never hardcode secrets here.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "CrisisMind AI"
    ENV: str = "development"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # LLM
    FIREWORKS_API_KEY: str = ""
    FIREWORKS_MODEL: str = "accounts/fireworks/models/deepseek-v4-pro"
    FIREWORKS_BASE_URL: str = "https://api.fireworks.ai/inference/v1"

    # Search
    TAVILY_API_KEY: str = ""
    TAVILY_BASE_URL: str = "https://api.tavily.com"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_REPORTS_TABLE: str = "reports"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
