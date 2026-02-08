from pydantic_settings import SettingsConfigDict, BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Database settings
    database_url: str
    db_echo: bool = False

    # JWT settings
    secret_key: str = os.getenv('SECRET_KEY', 'your-super-secret-test-key-change-in-production-please')
    jwt_expiration_days: int = 7

    # Application settings
    app_name: str = "Todo Web Application"
    debug: bool = False
    api_prefix: str = "/api"

    # OAuth settings
    github_client_id: Optional[str] = None
    github_client_secret: Optional[str] = None
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    frontend_url: str = "http://localhost:3000"
    gemini_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None


settings = Settings()
