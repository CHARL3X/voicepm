import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from openai import OpenAI
from pathlib import Path
import sys

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.append(str(backend_dir))

from config import settings
from routes.audio import router as audio_router
from routes.health import router as health_router
from services.audio import create_openrouter_client

# Get the project root directory
ROOT_DIR = Path(__file__).parent.parent

app = FastAPI(title="VoicePM API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory=str(ROOT_DIR / "static")), name="static")

# Initialize clients
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
openrouter_client = create_openrouter_client(settings.OPENROUTER_API_KEY)

# Check if we have valid API keys
DEMO_MODE = (
    not settings.OPENAI_API_KEY or 
    settings.OPENAI_API_KEY == "demo_mode"
)

if DEMO_MODE:
    print("\n=== Running in DEMO MODE ===")
    print("No valid API key found. The application will return mock data.")
    print("To use real processing, set valid API key in the .env file:\n")
    print("OPENAI_API_KEY=your_key_here\n")
else:
    print("\n=== Running in PRODUCTION MODE ===")
    print("API clients initialized successfully\n")

# Include routers
app.include_router(audio_router)
app.include_router(health_router)

# Make dependencies available to routes
app.state.demo_mode = DEMO_MODE
app.state.openai_client = openai_client
app.state.openrouter_client = openrouter_client

@app.get("/")
async def read_root():
    """Serve the main HTML page."""
    return FileResponse(str(ROOT_DIR / "index.html"))

if __name__ == "__main__":
    import uvicorn
    print(f"\nStarting server in {'DEMO' if DEMO_MODE else 'PRODUCTION'} mode...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
