import os
from pydantic_settings import BaseSettings
from pydantic import AnyUrl, HttpUrl
from typing import List

class Settings(BaseSettings):
    """
    Application settings and environment variables configuration
    """
    SUPABASE_URL: str  # Changed from AnyUrl to str for better compatibility
    SUPABASE_SERVICE_ROLE_KEY: str
    BACKEND_CORS_ORIGINS: List[str] = []  # e.g. ["https://your-netlify-app.netlify.app"]
    ADMIN_API_KEY: str  # secret for admin endpoints and reminder trigger
    # For file uploads:
    STORAGE_BUCKET: str  # Supabase Storage bucket name for file uploads

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()