from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

env_path = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        title="env file config's",
        env_file=env_path,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DB_URL: str
    REDIS_DB_URL: str

    LOG_LEVEL: str

    GOOGLE_GEMINI_API_KEY: str
    TRAVILY_API_KEY: str

    VERSION: str
    APP_NAME: str
    ENVIRONMENT: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    SECRET_KEY: str
    JWT_SECRET_KEY: str

    FRONTEND_REDIRECT_URL: str
    AUTH_REDIRECT_URL: str
    FRONTEND_ORIGINS: str

    HTTPONLY: bool
    SECURE: bool
    SAMESITE: Literal["lax", "strict", "none"]


settings = Settings()
