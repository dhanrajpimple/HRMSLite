"""Application settings loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central configuration for the HRMS Lite application.

    Values are read from environment variables and/or a `.env` file.
    """

    DATABASE_URL: str
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    ENVIRONMENT: str = "production"  # default to production for safety
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
