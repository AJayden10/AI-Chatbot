"""
Configuration settings for ServicePilot backend
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost:5432/servicepilot"
    
    # OpenAI
    openai_api_key: str = ""
    
    # Server
    port: int = 8000
    host: str = "0.0.0.0"
    
    # JWT
    jwt_secret: str = "your-secret-key-change-in-production"
    
    # Sentiment Analysis
    negative_sentiment_threshold: float = -0.5
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
