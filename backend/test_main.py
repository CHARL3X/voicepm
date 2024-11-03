import pytest
from fastapi.testclient import TestClient
from .main import app
import os

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    
    # If API keys are not set, should return warning
    if not os.getenv("OPENAI_API_KEY") or not os.getenv("ANTHROPIC_API_KEY"):
        assert data["status"] == "warning"
        assert "message" in data
    else:
        assert data["status"] == "healthy"

def test_process_audio_invalid_file():
    # Test with non-audio file
    files = {"file": ("test.txt", b"test content", "text/plain")}
    response = client.post("/process-audio/", files=files)
    assert response.status_code == 400
    assert "File must be an audio file" in response.json()["detail"]

def test_process_audio_missing_file():
    response = client.post("/process-audio/")
    assert response.status_code == 422  # FastAPI validation error

@pytest.mark.skip(reason="Requires valid API keys and audio file")
def test_process_audio_success():
    # This test requires:
    # 1. Valid API keys in environment
    # 2. A test audio file
    # Enable and modify this test in your development environment
    
    test_audio = "test_audio.mp3"
    if not os.path.exists(test_audio):
        pytest.skip(f"Test audio file {test_audio} not found")
    
    with open(test_audio, "rb") as f:
        files = {"file": (test_audio, f, "audio/mpeg")}
        response = client.post("/process-audio/", files=files)
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert "tasks" in data
    assert "next_steps" in data
    assert "notes" in data
    
    # Verify tasks structure
    assert len(data["tasks"]) > 0
    for task in data["tasks"]:
        assert "title" in task
        assert "priority" in task
        assert task["priority"] in ["High", "Medium", "Low"]

def test_cors_headers():
    response = client.options("/health", headers={
        "origin": "http://localhost:8080",
        "access-control-request-method": "GET"
    })
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert "access-control-allow-methods" in response.headers
