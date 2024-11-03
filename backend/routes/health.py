from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/health")
async def health_check(request: Request):
    """Health check endpoint to verify API status."""
    if request.app.state.demo_mode:
        return {
            "status": "demo",
            "message": "Running in demo mode. Set valid API key to enable real processing."
        }
    return {
        "status": "production",
        "message": "Running in production mode with valid API key"
    }
