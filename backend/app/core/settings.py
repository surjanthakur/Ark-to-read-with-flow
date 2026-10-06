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

    # db configs
    DB_URL: str

    REDIS_DB_URL: str
    REDIS_PASSWORD: str
    REDIS_USERNAME: str
    REDIS_PORT: str
    REDIS_MAX_CONNECTION: int

    # platform keys configs
    GOOGLE_GEMINI_API_KEY: str
    TRAVILY_API_KEY: str

    # oauth configs
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    AUTHORIZE_URL: str
    ACCESS_TOKEN_URL: str
    JWKS_URL: str
    PROJECT_ID: str
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    AUTH_REDIRECT_URL: str
    FRONTEND_ORIGINS: str
    SESSION_EXPIRY: int


settings = Settings()
