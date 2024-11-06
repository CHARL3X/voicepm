# VoicePM Repository Guide: Complete Architecture & Relationships

## 🌟 Core Purpose
VoicePM (Unscatter) is a voice-to-structured-content application that converts spoken thoughts into organized formats like task lists, roadmaps, process documentation, and constellation maps.

## 📁 Repository Structure

### 🔧 Backend Architecture (`/backend/`)

#### Core Files
- `main.py`: Application entry point
  - Initializes FastAPI application
  - Sets up CORS middleware
  - Mounts static files
  - Manages API clients (OpenAI, OpenRouter)
  - Implements demo/production mode switching

- `config.py`: Configuration management
  - Handles environment variables
  - Manages API keys (OpenAI, Anthropic, OpenRouter)
  - Controls CORS settings
  - Uses Pydantic for type-safe configuration

- `requirements.txt`: Dependencies
  ```
  openai==1.3.5
  fastapi==0.104.1
  uvicorn==0.24.0
  python-multipart==0.0.6
  pydantic==2.5.1
  pydantic-settings==2.1.0
  python-dotenv==1.0.0
  pytest==7.4.3
  ```

#### Models (`/backend/models/`)
Data structure definitions using Pydantic:

- `task.py`:
  ```python
  - Task: title, priority, description
  - ProcessedOutput: tasks, next_steps, notes
  ```

- `roadmap.py`:
  ```python
  - RoadmapSection: title, priority, timeline, content
  - StrategicRoadmap: market_analysis, resource_requirements,
                      dependencies, milestones, success_metrics
  ```

- `process.py`:
  ```python
  - ProcessStep: number, action, details, outcome
  - ProcessDocument: title, overview, prerequisites, steps, notes
  ```

- `constellation.py`:
  ```python
  - ConstellationNode: id, title, type, connections
  - ConstellationMap: nodes, relationships, insights, patterns
  ```

#### Prompts (`/backend/prompts/`)
AI system prompts for different output formats:

- `task_prompt.py`: Structures voice input into actionable tasks
- `roadmap_prompt.py`: Creates strategic roadmaps with sections
- `process_prompt.py`: Generates step-by-step process documentation
- `constellation_prompt.py`: Maps relationships and patterns

#### Services (`/backend/services/`)
Core functionality implementations:

- `audio.py`: Handles audio processing and transcription
  - OpenAI Whisper integration
  - Audio file validation
  - Transcription processing
- `constellation.py`: Handles constellation mapping
  - Pattern recognition
  - Relationship mapping
  - Strategic insights

#### Routes (`/backend/routes/`)
API endpoint definitions:

- `audio.py`: Audio upload and processing endpoints
- `health.py`: Health check endpoint for monitoring

### 🎨 Frontend Architecture

#### CSS Structure (`/static/css/`)

Base Styles:
- `base/variables.css`: Design tokens and theme variables
  - Colors, typography, spacing
  - Gradients and animations
  - Shadows and effects
- `base/reset.css`: CSS reset/normalize

Components:
- `components/task-output.css`: Task list visualization
- `components/roadmap-output.css`: Roadmap visualization
- `components/process-output.css`: Process documentation
- `components/constellation-output.css`: Constellation visualization
  - Node relationships
  - Pattern highlighting
  - Interactive connections
- `components/cards.css`: Card component styles
- `components/steps.css`: Progress step indicators
- `components/marketing.css`: Marketing section styles
- `components/upload.css`: File upload interface
- `components/progress.css`: Progress indicators
- `components/badges.css`: Badge component styles

Layout:
- `layout/grid.css`: Grid system
- `layout/header.css`: Header styling

Animations:
- `animations/transitions.css`: Animation definitions

#### JavaScript (`/static/js/`)
Core Modules:
- `app.js`: Main application logic
- `modules/`:
  - `audio-handler.js`: Audio file processing
  - `ui-handler.js`: UI state management
  - `format-handler.js`: Output format handling
  - `constellation-handler.js`: Constellation visualization
  - `content-renderer.js`: Dynamic content rendering

#### HTML
- `index.html`: Main application page
  - Application structure
  - Component integration
  - Script/style loading

### 📦 Deployment

- `render.yaml`: Render.com deployment configuration
  ```yaml
  - Python environment setup
  - Environment variables
  - Build/start commands
  - Static file serving
  - Auto-scaling configuration
  ```

## 🔄 Data Flow & Relationships

1. User Interaction Flow:
   ```
   Upload Audio → Transcription → Format Selection → 
   AI Processing → Structured Output → Visual Rendering
   ```

2. Backend Processing Flow:
   ```
   Audio Upload → Whisper Transcription → 
   Claude Processing (with format-specific prompt) →
   Pydantic Model Validation → JSON Response
   ```

3. Frontend Rendering Flow:
   ```
   JSON Response → Format-specific CSS → 
   Interactive Components → User Interface
   ```

## 🔗 Key Component Relationships

1. Model-Prompt Alignment:
   - Each model has a corresponding prompt
   - Prompts ensure AI output matches model structure

2. CSS-Model Alignment:
   - Output format CSS files mirror backend models
   - Visualization designed for specific data structures

3. Service-Route Integration:
   - Routes use services for core functionality
   - Services handle business logic and external API calls

4. Configuration-Deployment Sync:
   - render.yaml reflects config.py requirements
   - Environment variables managed consistently

## 🚀 Development Workflow

1. Local Development:
   ```bash
   # Start server from backend directory
   cd backend
   python -m uvicorn main:app --reload
   ```

2. Deployment:
   - Push to main branch
   - Render.com auto-deploys
   - Environment variables synced from dashboard

## 📈 Scalability Considerations

1. Backend:
   - Auto-scaling configuration in render.yaml
   - Memory/CPU monitoring
   - Health check endpoint

2. Frontend:
   - Modular CSS for maintainability
   - Responsive design patterns
   - Progressive enhancement

## 🔒 Security Features

1. API Security:
   - Environment variable management
   - CORS configuration
   - API key protection

2. File Processing:
   - File type validation (MP3, M4A, WAV)
   - Size limitations (25MB max)
   - Secure file handling

## 🔍 Recent Updates

1. Mobile File Upload Enhancement:
   - Added explicit MIME type support for iOS
   - Improved file validation feedback
   - Enhanced error messaging

2. Constellation Format Addition:
   - New visualization component
   - Pattern recognition capabilities
   - Relationship mapping features

3. Backend Optimizations:
   - Enhanced CORS configuration
   - Improved error handling
   - Better API response formatting

This guide serves as a comprehensive reference for understanding the VoicePM codebase structure, relationships, and implementation details.
