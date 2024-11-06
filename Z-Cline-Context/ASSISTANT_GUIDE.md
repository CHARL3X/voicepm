# Voxify (VoicePM) Assistant Guide

## Application Overview

Voxify is a web application that transforms voice memos into structured outputs using AI. The app offers three main conversion formats:

1. Task Lists (Free Tier)
   - Extracts actionable tasks and priorities
   - Organizes into clear project plans
   - Preserves context and relationships

2. Strategic Roadmaps (Pro Tier)
   - Comprehensive strategic planning
   - Market analysis integration
   - Resource allocation suggestions

3. Process Documentation (Pro Tier)
   - Detailed step-by-step documentation
   - Prerequisites and dependencies
   - Expected outcomes and success metrics

## Architecture

### Frontend
- Pure HTML/CSS/JS implementation
- Modular CSS architecture:
  ```
  static/css/
  ├── styles.css (main imports)
  ├── base/
  │   ├── variables.css (theme)
  │   └── reset.css (base styles)
  ├── layout/
  │   ├── grid.css (layout)
  │   └── header.css (sections)
  ├── components/
  │   ├── cards.css
  │   ├── badges.css
  │   └── upload.css
  └── animations/
      └── transitions.css
  ```

### Backend
- FastAPI framework
- Modular structure:
  ```
  backend/
  ├── main.py (app initialization)
  ├── config.py (settings)
  ├── routes/
  │   ├── audio.py (endpoints)
  │   └── health.py
  ├── services/
  │   └── audio.py (AI processing)
  ├── models/
  │   ├── process.py
  │   ├── roadmap.py
  │   └── task.py
  └── utils/
      └── demo.py
  ```

### AI Integration
- OpenAI Whisper for audio transcription
- Claude via OpenRouter for analysis
- Structured JSON outputs for each format

## Key Files & Their Purpose

1. `main.py`
   - FastAPI app initialization
   - Middleware configuration
   - Client initialization
   - Route registration

2. `config.py`
   - Environment variables
   - API key management
   - CORS settings

3. `services/audio.py`
   - OpenRouter client creation
   - Transcript processing logic
   - Format-specific handlers

4. `index.html`
   - Main application interface
   - Format selection
   - File upload handling

5. `render.yaml`
   - Deployment configuration
   - Environment variable setup
   - Build and start commands

## Deployment & Environment

### Production (Render.com)
- Backend URL: https://voicepm-backend.onrender.com
- Environment Variables:
  ```yaml
  OPENAI_API_KEY: Required for transcription
  OPENROUTER_API_KEY: Required for analysis
  CORS_ORIGINS: Allowed origins array
  ```

### Local Development
- Backend runs on http://localhost:8000
- Frontend served statically
- .env file for local configuration

## Important Nuances

1. API Key Handling
   - Keys must be set in Render.com dashboard
   - Local .env file for development
   - Falls back to demo mode if keys missing

2. CORS Configuration
   - Permissive in development
   - Strict in production
   - Configured via environment variable

3. File Processing
   - 25MB file size limit
   - Supported formats: MP3, M4A, WAV
   - Temporary file cleanup

4. Error Handling
   - Graceful fallback to demo mode
   - Detailed error messages
   - Client-side validation

## Best Practices for Assistance

1. Code Modifications
   - Always preserve backend functionality
   - Test locally before suggesting changes
   - Maintain modular CSS structure
   - Follow existing naming conventions

2. Feature Additions
   - Respect tier limitations (Free/Pro)
   - Maintain consistent UI/UX
   - Consider mobile responsiveness
   - Document new functionality

3. Problem Solving
   - Check logs for specific errors
   - Verify API key configuration
   - Test in demo mode first
   - Consider CORS implications

4. UI Improvements
   - Use existing color variables
   - Follow component patterns
   - Maintain accessibility
   - Test responsive behavior

## Common Tasks

1. Styling Updates
   - Modify relevant CSS module
   - Use CSS variables for consistency
   - Test responsive breakpoints
   - Verify dark theme compatibility

2. Backend Changes
   - Update relevant service module
   - Maintain error handling
   - Test with and without API keys
   - Verify CORS compatibility

3. Feature Implementation
   - Plan frontend and backend changes
   - Consider authentication needs
   - Maintain demo mode support
   - Document new endpoints

4. Troubleshooting
   - Check API key configuration
   - Verify CORS settings
   - Review service logs
   - Test in demo mode

Remember: The application is designed to be robust and user-friendly, with graceful fallbacks and clear error handling. Always maintain these principles when suggesting changes or improvements.

[Previous content remains the same until "Best Practices for Assistance", where we add:]

## Critical Learnings & Guidelines

1. Change Management
   - "If it's running perfectly, be extremely cautious with changes"
   - Always confirm if changes are necessary
   - Prefer small, incremental changes over large rewrites
   - When in doubt, ask before making changes

2. Windows-Specific Considerations
   - Don't use '&&' in command chains (Windows limitation)
   - Use semicolon ';' for command separation
   - Be mindful of path separators (use forward slashes)
   - Current working directory is 'z:/IDEAS'

3. Development Philosophy
   - "Safe changes first" - Start with visual/UI changes that don't affect core functionality
   - Always have a rollback plan
   - Test thoroughly before suggesting changes
   - Keep the backend stable and working

4. Communication Style
   - Be direct and technical rather than conversational
   - Don't start responses with "Great", "Certainly", "Okay", "Sure"
   - Focus on concrete actions and solutions
   - Ask specific, targeted questions when needed

5. Working with Files
   - Always check if files exist before suggesting changes
   - Use appropriate tools for file operations
   - Maintain existing file structure
   - Keep backups of critical files

6. Testing Approach
   - Test locally first
   - Verify changes don't break existing functionality
   - Check both development and production environments
   - Consider all supported file formats and sizes

[Rest of the previous content remains the same]