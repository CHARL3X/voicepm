"""
Configuration Module

This module handles configuration settings for the VoicePM backend,
loading environment variables and providing type-safe access to settings.

Environment Variables:
    OPENAI_API_KEY: API key for OpenAI services
    ANTHROPIC_API_KEY: API key for Anthropic services
    OPENROUTER_API_KEY: API key for OpenRouter services
    CORS_ORIGINS: List of allowed origins for CORS
    DEMO_MODE: Enable demo mode (set to "true" to enable)

The Settings class uses Pydantic for validation and provides default values
where appropriate. Settings are loaded from environment variables or .env file.
"""

import os
import json
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings with validation."""
    
    # Demo mode - defaults to False, enable through environment
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "").lower() == "true"
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    
    # CORS Settings - Parse from environment or use default
    CORS_ORIGINS: List[str] = json.loads(os.getenv("CORS_ORIGINS", '["*"]'))
    
    class Config:
        """Pydantic config for settings."""
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings()
