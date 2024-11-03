# Voxify Backend

The backend service for Voxify, handling voice memo processing and structured data generation.

## Architecture Overview

### Core Components

1. **Models Layer** (`models/`)
   - Task format: `Task`, `ProcessedOutput`
   - Roadmap format: `RoadmapSection`, `StrategicRoadmap`
   - Process format: `ProcessDocument`, `ProcessStep`

2. **Routes Layer** (`routes/`)
   - `audio.py`: Main processing endpoints
   - `health.py`: Health check endpoint

3. **Services Layer** (`services/`)
   - `audio.py`: Transcript processing logic
   - OpenAI/OpenRouter client management

4. **Prompts Layer** (`prompts/`)
   - Format-specific system prompts
   - AI instruction templates

5. **Utils Layer** (`utils/`)
   - Demo data generation
   - Helper functions

## Setup & Running

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API keys
```

### Running the Server

**IMPORTANT**: Always run uvicorn from the backend directory to ensure proper path resolution:

```bash
# CORRECT way to run:
cd Apps-CODE/voicepm/backend
uvicorn main:app --reload

# DO NOT run from other directories:
# ❌ cd Apps-CODE/voicepm && uvicorn backend.main:app
# This will cause PATH resolution issues
```

## API Endpoints

### Audio Processing
- `POST /process-audio`: Convert to task list
- `POST /process-audio/roadmap`: Generate roadmap
- `POST /process-audio/process`: Create process doc

### Health Check
- `GET /health`: Server status and mode

## Development Modes

1. **Production Mode**
   - Set valid API keys in .env
   - Full audio processing
   - AI-powered analysis

2. **Demo Mode**
   - Set `OPENAI_API_KEY=demo_mode`
   - Returns mock data
   - No API calls made

## Integration Points

- **Frontend**: Communicates via REST API
- **AI Services**: 
  - OpenAI Whisper for transcription
  - Claude 3.5 Sonnet for analysis
- **Deployment**: Render.com
- **Frontend Embed**: Wix integration

## File Structure
```
backend/
├── models/
│   ├── __init__.py
│   ├── task.py
│   ├── roadmap.py
│   └── process.py
├── prompts/
│   ├── __init__.py
│   ├── task_prompt.py
│   ├── roadmap_prompt.py
│   └── process_prompt.py
├── routes/
│   ├── __init__.py
│   ├── audio.py
│   └── health.py
├── services/
│   ├── __init__.py
│   └── audio.py
├── utils/
│   ├── __init__.py
│   └── demo.py
├── main.py
└── config.py
```

## Dependencies

- FastAPI: Web framework
- Uvicorn: ASGI server
- OpenAI: Whisper API
- OpenRouter: Claude API
- Pydantic: Data validation
- Python-multipart: File uploads
- Python-dotenv: Environment management
