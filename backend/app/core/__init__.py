"""
app.core.config — Centralized configuration using Pydantic Settings.

All environment variables are loaded here and validated at startup.
This is the SINGLE source of truth for configuration — no scattered
os.getenv() calls throughout the codebase.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── App ─────────────────────────────────────────────────
    APP_NAME: str = "RouteAura"
    APP_ENV: str = "development"  # development | staging | production
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:5174"

    @property
    def allowed_origins_list(self) -> List[str]:
        if self.APP_ENV == "development":
            return ["*"]
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    # ── Database ────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/routeaura"

    @property
    def database_url_sync(self) -> str:
        """Alembic needs a synchronous URL."""
        return self.DATABASE_URL.replace("+asyncpg", "+psycopg2")

    # ── Redis ───────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT / Auth ──────────────────────────────────────────
    JWT_SECRET_KEY: str = "CHANGE-ME-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── AI / LLM ───────────────────────────────────────────
    USE_LLM: bool = True
    LLM_PRIMARY_PROVIDER: str = "mistral"  # mistral | openai | anthropic
    MISTRAL_API_KEY: Optional[str] = None
    MISTRAL_MODEL: str = "mistral-small-latest"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-haiku-20240307"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 300

    # ── Voice / TTS / STT ──────────────────────────────────
    SARVAM_API_KEY: Optional[str] = None
    DEFAULT_SARVAM_SPEAKER: str = "meera"

    # ── Razorpay ────────────────────────────────────────────
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None

    # ── External APIs ───────────────────────────────────────
    AVIATIONSTACK_API_KEY: Optional[str] = None
    AMADEUS_API_KEY: Optional[str] = None
    AMADEUS_API_SECRET: Optional[str] = None
    RAILAPI_KEY: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


# Singleton — instantiated once at import time.
# Every module imports this same instance.
settings = Settings()
