# VoicePM - Voice Project Manager

VoicePM is a web application that converts voice memos into structured project management artifacts. Upload your audio recordings, and the system will automatically extract tasks, priorities, next steps, and important notes using advanced AI processing.

## Features

- Audio file upload (supports MP3, M4A, WAV, and other formats)
- Automatic transcription using OpenAI Whisper
- Task extraction and organization using Claude
- Priority-based task categorization
- Clean, responsive user interface
- Drag-and-drop file upload support
- Real-time processing status updates
- Demo mode for testing without API keys
- Wix integration support

## Deployment Options

### 1. Standalone Application

Run VoicePM as a standalone web application. See [Setup](#setup) below.

### 2. Wix Integration

Embed VoicePM into your Wix website:
1. Deploy the backend to a cloud platform
2. Host the embed version
3. Add to your Wix site via iFrame

See [WIX-INTEGRATION.md](./WIX-INTEGRATION.md) for detailed instructions.

## Project Structure

```
voicepm/
├── backend/
│   ├── __init__.py      # Python package marker
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration management
│   ├── test_main.py     # Backend tests
│   └── requirements.txt # Python dependencies
├── static/
│   ├── css/
│   │   └── styles.css   # Application styles
│   └── js/
│       └── app.js       # Frontend JavaScript
├── wix-embed/
│   └── voicepm-embed.html  # Wix-ready version
└── index.html          # Main HTML file
```

## Demo Mode vs Production Mode

The application can run in two modes:

### Demo Mode
- No API keys required
- Returns mock data for testing the interface
- Clearly marked with "[DEMO]" in responses
- Perfect for initial testing and development

### Production Mode
- Requires valid OpenAI and Anthropic API keys
- Performs real audio transcription and analysis
- Provides actual task extraction from your voice memos

## Setup

### Prerequisites

- Python 3.7+
- OpenAI API key (for production mode)
- Anthropic API key (for production mode)

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd voicepm
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Configuration

1. Create a `.env` file in the backend directory:

For Demo Mode:
```env
OPENAI_API_KEY=demo_mode
ANTHROPIC_API_KEY=demo_mode
CORS_ORIGINS=["http://localhost:8000"]
```

For Production Mode:
```env
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
CORS_ORIGINS=["http://localhost:8000"]
```

### Running the Application

1. Start the server:
```bash
cd backend
python main.py
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

The application will automatically detect if you're in demo or production mode based on your API keys. The mode is clearly displayed in the UI and all responses are appropriately labeled.

## Cloud Deployment

For production deployment, see:
- [Render.com Deployment Guide](./docs/render-deployment.md)
- [Heroku Deployment Guide](./docs/heroku-deployment.md)
- [Wix Integration Guide](./WIX-INTEGRATION.md)

## API Documentation

### Endpoints

#### POST /process-audio/
Process an audio file and return structured information.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'file' field containing the audio file

**Response:**
```json
{
    "tasks": [
        {
            "title": "Task description",
            "priority": "High/Medium/Low",
            "description": "Additional context"
        }
    ],
    "next_steps": [
        "Immediate action item"
    ],
    "notes": [
        "Important context or information"
    ]
}
```

#### GET /health
Check the API health status and mode.

**Response:**
```json
{
    "status": "demo",
    "message": "Running in demo mode. Set valid API keys to enable real processing."
}
```

or

```json
{
    "status": "production",
    "message": "Running in production mode with valid API keys"
}
```

## Development Guidelines

### Backend

1. Code Style
   - Follow PEP 8 guidelines
   - Use type hints
   - Document functions and classes
   - Handle errors gracefully

2. Error Handling
   - Use appropriate HTTP status codes
   - Provide meaningful error messages
   - Log errors for debugging
   - Clean up temporary files

3. Configuration
   - Use environment variables for sensitive data
   - Keep configuration separate from code
   - Validate configuration on startup

### Frontend

1. Code Organization
   - Use classes for better organization
   - Handle errors gracefully
   - Show loading states
   - Provide feedback to users

2. User Experience
   - Support drag and drop
   - Show progress indicators
   - Handle offline mode gracefully
   - Provide clear error messages

## Security Considerations

1. API Keys
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly
   - Use appropriate key permissions

2. File Upload
   - Validate file types
   - Limit file sizes
   - Clean up temporary files
   - Scan for malware (in production)

3. Production Deployment
   - Use HTTPS
   - Implement authentication
   - Set up monitoring
   - Configure proper logging

## Testing

Run backend tests:
```bash
cd backend
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details
