# Voxify Project Analysis and Technical Documentation

## Project Overview
Voxify is a web application that transforms voice memos into structured content using AI. It supports three output formats:
- Task Lists (Free): Converts audio into prioritized tasks with context
- Strategic Roadmaps (Pro): Generates comprehensive project roadmaps
- Process Documentation (Pro): Creates detailed process guides

### Architecture
- **Frontend**: Static HTML/JS/CSS served by FastAPI
- **Backend**: Python/FastAPI application
- **AI Integration**: 
  - OpenAI Whisper for transcription
  - Claude 3.5 Sonnet for analysis
- **Deployment**: Render.com with Wix embedding

## Recent Issues and Solutions

### 1. Mobile File Upload Issue
**Problem**: iOS devices only showing video files in file picker, not audio files.

**Root Cause**:
- Generic `accept="audio/*"` attribute not specific enough for iOS
- iOS handling MIME types differently from other platforms

**Solution Implemented**:
```html
<!-- Updated file input with explicit MIME types -->
<input type="file" accept=".mp3,audio/mp3,.m4a,audio/m4a,.wav,audio/wav,audio/x-m4a">
```

**Backend Changes**:
```python
ALLOWED_MIME_TYPES = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/x-m4a',  # Added for iOS
    'audio/m4a'     # Alternative M4A type
]
```

### 2. Backend Connection Issues
**Problem**: Render.com deployment showing errors and connection issues.

**Root Causes**:
- CORS configuration not properly set for Wix domain
- Error handling not comprehensive enough
- File handling issues on server

**Solutions**:
1. Enhanced CORS Configuration:
```python
CORS_ORIGINS = [
    "https://www.charlestobin.com",  # Main Wix site
    "https://editor.wix.com",        # Wix editor
    "http://localhost:8000"          # Local development
]
```

2. Improved Error Handling:
```javascript
async processAudio(file, audioItem, button) {
    try {
        // Enhanced error messages
        let errorMessage = 'Error processing audio file';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network error occurred. Please try again.';
        }
        // Added retry logic for 5xx errors
        if (response.status >= 500 && retryCount < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return this.processAudio(file, audioItem, button, retryCount + 1);
        }
    } catch (error) {
        // Enhanced error handling
    }
}
```

### 3. Local Development Setup Issues
**Problem**: Difficulty running server locally due to Python path and module conflicts.

**Root Causes**:
- Conflicting main.py in site-packages
- Python path resolution issues
- Git repository initialization conflicts

**Solutions**:
1. Run server from correct directory:
```bash
cd Apps-CODE/voicepm/backend
python -m uvicorn main:app --reload
```

2. Remove conflicting modules:
```bash
pip uninstall gitpython
```

## Key Components and Files

### 1. Frontend Structure
```
static/
├── css/
│   └── styles.css      # Main styling
├── js/
│   └── app.js          # Core frontend logic
└── images/             # SVG assets
```

**Important Frontend Files**:
- `index.html`: Main application page
- `app.js`: Core frontend logic (VoicePM class)
- `styles.css`: Application styling

### 2. Backend Structure
```
backend/
├── models/             # Data models
├── prompts/           # AI system prompts
├── routes/            # API endpoints
├── services/          # Business logic
└── utils/             # Helper functions
```

**Critical Backend Files**:
1. `main.py`: Application entry point
   - FastAPI setup
   - Middleware configuration
   - Static file serving
   - API client initialization

2. `routes/audio.py`: Audio processing endpoints
   - File upload handling
   - Format-specific processing
   - Error handling

3. `services/audio.py`: AI integration
   - Whisper transcription
   - Claude analysis
   - Response formatting

4. `utils/demo.py`: Demo mode implementation
   - Mock data for each format
   - Testing support

## Integration Points

### 1. Wix Integration
- Backend deployed on Render.com
- Frontend embedded in Wix using custom HTML component
- Cross-origin communication handled via CORS

### 2. AI Integration
- **Whisper API**:
  - Used for audio transcription
  - Handles multiple audio formats
  - Error handling for failed transcriptions

- **Claude Integration**:
  - Format-specific system prompts
  - JSON response parsing
  - Retry logic for failed requests

## Deployment Considerations

### 1. Environment Setup
```python
# .env configuration
OPENAI_API_KEY=sk-...     # For Whisper
OPENROUTER_API_KEY=sk-... # For Claude
CORS_ORIGINS=[...]        # Allowed origins
```

### 2. Render.com Configuration
```yaml
# render.yaml
services:
  - type: web
    name: voicepm-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0
```

### 3. Production Checks
- API key validation
- CORS configuration
- File size limits
- Error handling
- Demo mode fallback

## Future Considerations

### 1. Performance Improvements
- Implement caching for transcriptions
- Add request queueing
- Optimize file handling

### 2. Feature Enhancements
- Real-time transcription
- Additional output formats
- Collaborative features
- Export options

### 3. Security Improvements
- Rate limiting
- File validation
- User authentication
- API key rotation

### 4. Monitoring and Maintenance
- Error tracking
- Usage analytics
- API health monitoring
- Backup procedures

## Development Guidelines

### 1. Local Testing
```bash
# Start server from backend directory
cd Apps-CODE/voicepm/backend
python -m uvicorn main:app --reload

# Test endpoints
curl http://localhost:8000/health
```

### 2. Code Organization
- Keep AI prompts in separate files
- Use type hints for better maintainability
- Follow FastAPI best practices
- Maintain comprehensive error handling

### 3. Git Workflow
```bash
# Before pushing changes
git checkout main
git pull origin main
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "Description of changes"
git push origin feature/your-feature
```

### 4. Deployment Process
1. Test changes locally
2. Push to GitHub
3. Render.com auto-deploys
4. Verify in production
5. Monitor for errors

## Common Issues and Solutions

### 1. File Upload Issues
- Verify MIME type support
- Check file size limits
- Test on different devices
- Monitor upload errors

### 2. API Integration
- Handle rate limits
- Implement retry logic
- Log API responses
- Monitor costs

### 3. Error Handling
- Provide clear user messages
- Log detailed errors
- Implement fallbacks
- Monitor error rates

------------------------------------------------------------------



Let me enhance the overview and include the server status:

Problem Context:
1. Mobile File Upload Issue:
- iOS devices were showing only video files in picker, not audio files
- Video files were being rejected correctly, but users couldn't select audio
- Root cause: iOS requires explicit MIME type definitions for audio files
- Secondary issue: File validation needed to be more user-friendly

2. Backend Connection Issues:
- Render.com deployment showing connection errors
- Frontend-backend API communication issues
- Status badge showing "offline" even when server is running

Files We Modified:

1. Frontend Changes:
```html
// index.html
<!-- Updated file input to support iOS audio formats -->
<input type="file" id="fileInput" class="file-input" 
  accept=".mp3,audio/mp3,.m4a,audio/m4a,.wav,audio/wav,audio/x-m4a">

<!-- Status badge to show connection state -->
<span id="modeBadge" class="mode-badge demo">
    <i data-feather="radio"></i>
    <span>Demo Mode</span>
</span>
```

2. Backend Changes:
```python
# routes/audio.py
ALLOWED_MIME_TYPES = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/x-m4a',  # Added for iOS M4A support
    'audio/m4a'     # Alternative M4A MIME type
]

@router.post("/process-audio")
async def process_audio_to_tasks(request: Request, file: UploadFile = File(...)):
    # Enhanced MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload MP3, M4A, or WAV files. Received: {file.content_type}"
        )
```

3. Configuration & CORS:
```python
# backend/.env
OPENAI_API_KEY=sk-....
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...
CORS_ORIGINS=["https://www.charlestobin.com", "https://editor.wix.com", "http://localhost:8000"]
```

4. Frontend JavaScript:
```javascript
// app.js
class VoicePM {
    constructor() {
        this.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:8000'
            : 'https://voicepm-backend.onrender.com';
        this.isBackendAvailable = false;
        this.isDemoMode = false;
    }

    handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        const maxSize = 25 * 1024 * 1024;
        
        // Enhanced file validation with better error messages
        if (!file.type.match(/^audio\/(mp3|mpeg|wav|x-m4a)$/)) {
            this.showStatus('Please upload an MP3, M4A, or WAV file', 'error');
            return;
        }

        if (file.size > maxSize) {
            this.showStatus('File size must be under 25MB', 'error');
            return;
        }
        // ... rest of the code
    }
}
```

Current Status (Local Testing):
```bash
INFO:     Will watch for changes in these directories: ['Z:\\IDEAS']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [14392] using WatchFiles

Frontend Status:
- Page loads successfully at http://localhost:8000
- Status badge shows "offline" despite server running
- Static files (CSS, JS, images) loading correctly
```

Next Debug Steps:
1. Investigate why status badge shows "offline":
   - Check health endpoint response
   - Verify checkBackendHealth() function in app.js
   - Debug CORS if health check is failing

2. Test file upload functionality:
   - Test from iOS device
   - Verify MIME type handling
   - Check error messages

3. After local testing succeeds:
   - Push changes to GitHub
   - Verify Render.com deployment
   - Test on production URL

The fact that the page loads but shows "offline" suggests there might be an issue with the health check endpoint or CORS configuration. The server is running, but the frontend might not be able to successfully communicate with the backend API endpoints.