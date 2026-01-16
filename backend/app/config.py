from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str = "http://localhost:8000/auth/google/callback"
    jwt_secret: str = "dev_secret_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 24
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "phishbuster"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
