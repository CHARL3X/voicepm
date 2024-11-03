"""
Configuration Module

This module handles configuration settings for the VoicePM backend,
loading environment variables and providing type-safe access to settings.

Environment Variables:
    OPENAI_API_KEY: API key for OpenAI services
    ANTHROPIC_API_KEY: API key for Anthropic services
    OPENROUTER_API_KEY: API key for OpenRouter services
    CORS_ORIGINS: List of allowed origins for CORS

The Settings class uses Pydantic for validation and provides default values
where appropriate. Settings are loaded from environment variables or .env file.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings with validation."""
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    
    # CORS Settings
    CORS_ORIGINS: list = ["*"]  # Allow all origins for testing
    
    class Config:
        """Pydantic config for settings."""
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings()
