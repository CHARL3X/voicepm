import os
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from openai import OpenAI
import anthropic
from pydantic import BaseModel
import json
from pathlib import Path
from config import settings

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

# Check if we have valid API keys
DEMO_MODE = (
    not settings.OPENAI_API_KEY or 
    not settings.ANTHROPIC_API_KEY or 
    settings.OPENAI_API_KEY == "demo_mode" or 
    settings.ANTHROPIC_API_KEY == "demo_mode"
)

if DEMO_MODE:
    print("\n=== Running in DEMO MODE ===")
    print("No valid API keys found. The application will return mock data.")
    print("To use real processing, set valid API keys in the .env file:\n")
    print("OPENAI_API_KEY=your_openai_key_here")
    print("ANTHROPIC_API_KEY=your_anthropic_key_here\n")
else:
    # Configure API clients
    try:
        openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        claude_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        print("\n=== Running in PRODUCTION MODE ===")
        print("API clients initialized successfully\n")
    except Exception as e:
        print(f"\nError initializing API clients: {e}")
        print("Falling back to demo mode\n")
        DEMO_MODE = True

class Task(BaseModel):
    title: str
    priority: str
    description: str | None = None

class ProcessedOutput(BaseModel):
    tasks: List[Task]
    next_steps: List[str]
    notes: List[str]

CLAUDE_SYSTEM_PROMPT = """You are an expert project manager and organizational psychologist specializing in task analysis and workflow optimization. Your role is to analyze voice memo transcripts and extract actionable insights while maintaining the natural flow of thought.

When analyzing the transcript, consider:

1. Task Identification and Prioritization:
   - Identify both explicit and implicit tasks
   - Evaluate urgency and importance using the Eisenhower Matrix
   - Consider dependencies between tasks
   - Account for resource constraints and timeline implications

2. Strategic Planning:
   - Break down complex tasks into manageable steps
   - Identify critical path activities
   - Consider potential bottlenecks and risks
   - Suggest parallel work streams where possible

3. Context Preservation:
   - Maintain the original context of ideas
   - Capture relevant background information
   - Note any assumptions or constraints mentioned
   - Preserve relationships between different topics

Format the output as a JSON object with this exact structure:
{
    "tasks": [
        {
            "title": "Clear, actionable task description",
            "priority": "High/Medium/Low",
            "description": "Additional context, dependencies, or notes specific to this task"
        }
    ],
    "next_steps": [
        "Immediate, concrete actions to take",
        "Each step should be specific and actionable"
    ],
    "notes": [
        "Important context or background information",
        "Strategic considerations",
        "Potential risks or dependencies",
        "Resource requirements or constraints"
    ]
}

Ensure each task is:
- Actionable and clear
- Properly prioritized based on urgency and importance
- Enriched with relevant context
- Connected to the broader project goals"""

def get_demo_data() -> ProcessedOutput:
    """Return mock data for demo mode."""
    return ProcessedOutput(
        tasks=[
            Task(
                title="Review project timeline", 
                priority="High", 
                description="[DEMO] Need to align with Q4 goals"
            ),
            Task(
                title="Schedule team meeting", 
                priority="Medium", 
                description="[DEMO] Include remote team members"
            ),
            Task(
                title="Update documentation", 
                priority="Low", 
                description="[DEMO] Focus on new features"
            )
        ],
        next_steps=[
            "[DEMO] Complete timeline review by EOD",
            "[DEMO] Send meeting invitation for tomorrow",
            "[DEMO] Assign documentation tasks"
        ],
        notes=[
            "[DEMO] Timeline needs adjustment for Q4",
            "[DEMO] Include remote team members in meeting",
            "[DEMO] Documentation update can wait until next week"
        ]
    )

async def process_transcript(transcript: str) -> dict:
    """Process the transcript using Claude to extract structured information."""
    if DEMO_MODE:
        return get_demo_data().dict()
        
    try:
        message = claude_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            temperature=0,
            system=CLAUDE_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"""Analyze this voice memo transcript and extract tasks, next steps, and important notes. 
                    Focus on creating a clear, actionable project plan while preserving the context and relationships between ideas.
                    
                    Transcript:
                    {transcript}"""
                }
            ]
        )
        
        # Extract JSON from Claude's response
        response_text = message.content[0].text
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in Claude's response")
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing transcript: {str(e)}"
        )

@app.get("/")
async def read_root():
    """Serve the main HTML page."""
    return FileResponse(str(ROOT_DIR / "index.html"))

@app.post("/process-audio/", response_model=ProcessedOutput)
async def process_audio(file: UploadFile = File(...)):
    """Process an audio file and return structured information."""
    if not file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an audio file"
        )
    
    if DEMO_MODE:
        return get_demo_data()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Step 1: Transcribe audio using OpenAI Whisper
        try:
            with open(temp_path, "rb") as audio_file:
                transcript = openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error transcribing audio: {str(e)}"
            )
            
        # Step 2: Process transcript with Claude
        structured_data = await process_transcript(transcript.text)
        
        return ProcessedOutput(**structured_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API status."""
    if DEMO_MODE:
        return {
            "status": "demo",
            "message": "Running in demo mode. Set valid API keys to enable real processing."
        }
    return {
        "status": "production",
        "message": "Running in production mode with valid API keys"
    }

if __name__ == "__main__":
    import uvicorn
    print(f"\nStarting server in {'DEMO' if DEMO_MODE else 'PRODUCTION'} mode...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
