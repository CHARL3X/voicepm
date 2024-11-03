import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from openai import OpenAI
from pathlib import Path
from config import settings
from routes import audio_router, health_router
from services.audio import create_openrouter_client

# Get the project root directory
ROOT_DIR = Path(__file__).parent.parent

app = FastAPI(title="VoicePM API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "https://voxify.app"],
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

# Include routers with dependencies
async def get_demo_mode():
    return DEMO_MODE

async def get_openai_client():
    return openai_client

async def get_openrouter_client():
    return openrouter_client

app.include_router(
    audio_router,
    dependencies=[
        Depends(get_demo_mode),
        Depends(get_openai_client),
        Depends(get_openrouter_client)
    ]
)
app.include_router(
    health_router,
    dependencies=[Depends(get_demo_mode)]
)

@app.get("/")
async def read_root():
    """Serve the main HTML page."""
    return FileResponse(str(ROOT_DIR / "index.html"))

if __name__ == "__main__":
    import uvicorn
    print(f"\nStarting server in {'DEMO' if DEMO_MODE else 'PRODUCTION'} mode...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
