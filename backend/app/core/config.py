from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Quick Notes API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"
    
    # Firebase settings
    firebase_service_account_path: str = "firebase-service-account.json"
    
    # CORS settings
    cors_allow_origins: list[str] = Field(default_factory=lambda: ["*"])

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()