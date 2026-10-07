from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

env_path = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        title="env file config's",
        env_file=env_path,
        env_file_encoding="utf-8",
        extra="ignore",
    )
    # app configs
    VERSION: str
    APP_NAME: str
    ENVIRONMENT: str
    LOG_LEVEL: str
    API_V1_STR: str
    FRONTEND_ORIGINS: str

    # platform keys configs
    TRAVILY_API_KEY: str
    SENTRY_URL: str | None = None


settings = Settings()
