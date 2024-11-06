# VoicePM Backend Feature Implementation Guide

## Overview
This guide provides a comprehensive walkthrough for implementing new features in the VoicePM backend, using the Constellation Format as a case study. It covers the entire process from initial setup to troubleshooting common issues.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [File Dependencies](#file-dependencies)
3. [Implementation Process](#implementation-process)
4. [Common Pitfalls](#common-pitfalls)
5. [Best Practices](#best-practices)
6. [Case Study: Constellation Format](#case-study-constellation-format)

## Architecture Overview

### Core Components

#### Backend Components
1. **Models** (`/backend/models/`)
   - Define data structures using Pydantic
   - Handle validation and serialization
   - Provide type safety and documentation

2. **Services** (`/backend/services/`)
   - Implement business logic
   - Handle external API interactions
   - Process and transform data

3. **Routes** (`/backend/routes/`)
   - Define API endpoints
   - Handle request/response lifecycle
   - Manage file uploads and validation

4. **Utils** (`/backend/utils/`)
   - Provide helper functions
   - Handle demo data generation
   - Implement shared functionality

5. **Prompts** (`/backend/prompts/`)
   - Define AI system prompts
   - Guide model outputs
   - Maintain consistent response formats

#### Frontend Components
1. **Core Module** (`/static/js/core/`)
   - `voice-pm.js`: Main application class
   - Coordinates between modules
   - Manages application state
   - Handles DOM initialization

2. **Feature Modules** (`/static/js/modules/`)
   - `ui-handler.js`: DOM event listeners and UI interactions
   - `format-handler.js`: Output format selection and rendering
   - `audio-handler.js`: File uploads and audio processing
   - `content-renderer.js`: Dynamic content display
   - `constellation-handler.js`: Constellation visualization

3. **CSS Components** (`/static/css/components/`)
   - Component-specific styles:
     - `upload.css`: File upload interface
     - `cards.css`: Format selection cards
     - `progress.css`: Progress indicators
     - `constellation-output.css`: Constellation visualization
     - Additional format-specific styles

4. **CSS Base** (`/static/css/base/`)
   - `variables.css`: Design tokens and theme variables
   - `reset.css`: CSS reset/normalize

## File Dependencies

### Backend Critical Path
1. `models/[feature].py` → Define data structures
2. `models/__init__.py` → Export models
3. `utils/demo_[feature].py` → Create demo data
4. `utils/__init__.py` → Export utilities
5. `services/[feature].py` → Implement logic
6. `routes/audio.py` → Add endpoints

### Frontend Critical Path
1. `static/js/core/voice-pm.js` → Main application class
2. `static/js/modules/[feature]-handler.js` → Feature-specific logic
3. `static/css/components/[feature]-output.css` → Feature-specific styles
4. Required CSS imports in index.html:
   ```html
   <link rel="stylesheet" href="static/css/styles.css">
   <link rel="stylesheet" href="static/css/components/upload.css">
   <link rel="stylesheet" href="static/css/components/cards.css">
   <link rel="stylesheet" href="static/css/components/progress.css">
   <link rel="stylesheet" href="static/css/components/[feature]-output.css">
   ```

### Import Chain
```
Frontend:
index.html
  ↳ static/js/core/voice-pm.js
    ↳ static/js/modules/ui-handler.js
    ↳ static/js/modules/format-handler.js
    ↳ static/js/modules/audio-handler.js
    ↳ static/js/modules/content-renderer.js
    ↳ static/js/modules/[feature]-handler.js

Backend:
routes/audio.py
  ↳ services/[feature].py
    ↳ models/[feature].py
    ↳ prompts/[feature]_prompt.py
    ↳ utils/demo_[feature].py
```

## Implementation Process

1. **Plan Feature Structure**
   - Define data models
   - Plan service interactions
   - Design API endpoints
   - Consider UI components

2. **Backend Implementation**
   - Create Pydantic models
   - Implement service logic
   - Add route handlers
   - Generate demo data

3. **Frontend Integration**
   - Add feature module
   - Update UI handlers
   - Implement rendering logic
   - Style components

4. **Testing & Validation**
   - Unit test backend
   - Test API endpoints
   - Verify UI behavior
   - Check error handling

## Common Pitfalls

### 1. Frontend Module Issues
- **Problem**: Missing CSS imports
- **Solution**: Include all required CSS in index.html
  ```html
  <link rel="stylesheet" href="static/css/styles.css">
  <link rel="stylesheet" href="static/css/components/upload.css">
  <link rel="stylesheet" href="static/css/components/cards.css">
  <link rel="stylesheet" href="static/css/components/progress.css">
  ```

### 2. Pydantic Model Updates
- **Problem**: Outdated model configurations
- **Solution**: Use new Pydantic v2 syntax
  ```python
  # Old:
  class Config:
      schema_extra = {...}
  
  # New:
  model_config = {
      "json_schema_extra": {...}
  }
  ```

### 3. Module Visibility
- **Problem**: Modules not found
- **Solution**: Update __init__.py files
  ```python
  # In __init__.py:
  from .feature import FeatureOutput
  __all__ = ['FeatureOutput']
  ```

### 4. Module Initialization
- **Problem**: Incorrect initialization order
- **Solution**: Initialize handlers in correct order
  ```javascript
  initializeModules() {
      this.audioHandler = new AudioHandler(this);
      this.formatHandler = new FormatHandler(this);
      this.uiHandler = new UIHandler(this);
      this.contentRenderer = new ContentRenderer(this);
  }
  ```

## Best Practices

### 1. Code Organization
- Keep modules focused and single-purpose
- Follow consistent naming patterns
- Maintain clear file structure
- Document module interactions

### 2. Error Handling
- Use specific error types
- Provide helpful messages
- Implement fallback behavior
- Log errors appropriately

### 3. Testing
- Write comprehensive unit tests
- Test error cases
- Verify demo mode functionality
- Test UI interactions

### 4. Documentation
- Document all models and functions
- Include usage examples
- Explain complex logic
- Keep documentation updated

### 5. Frontend Organization
- Keep modules focused and single-purpose
- Maintain consistent event delegation patterns
- Ensure proper CSS imports
- Initialize modules in correct order
- Use clear naming conventions

## Case Study: Constellation Format

### Implementation Steps

1. **Model Definition**
   ```python
   # models/constellation.py
   class ConstellationOutput(BaseModel):
       title: str
       summary: str
       central_star: CentralStar
       orbits: List[OrbitInsight]
   ```

2. **Service Implementation**
   ```python
   # services/constellation.py
   class ConstellationService:
       async def process_transcript(self, transcript: str):
           # Process using Claude
           # Return structured data
   ```

3. **Demo Data**
   ```python
   # utils/demo_constellation.py
   def get_demo_constellation():
       return {
           "title": "Demo Constellation",
           # Sample data...
       }
   ```

4. **Route Handler**
   ```python
   # routes/audio.py
   @router.post("/process-audio/constellation")
   async def process_audio_to_constellation(
       request: Request,
       file: UploadFile = File(...)
   ):
       # Handle upload and processing
   ```

### Troubleshooting Flow

1. **Import Errors**
   - Check __init__.py files
   - Verify import paths
   - Use absolute imports

2. **Model Validation**
   - Update Pydantic configs
   - Verify field types
   - Check default values

3. **Service Integration**
   - Test API connections
   - Verify error handling
   - Check demo mode

## Conclusion

Adding new features to the VoicePM backend requires careful attention to the interdependencies between components. Following this guide ensures a smooth implementation process and maintains code quality and consistency.

Remember to:
1. Plan the feature structure
2. Implement in the correct order
3. Update all necessary files
4. Test thoroughly
5. Document changes

This process has been battle-tested through features like the Constellation Format and provides a reliable framework for future enhancements.

## Conclusion

Adding new features to the VoicePM backend requires careful attention to:
1. Following the established architecture
2. Implementing in the correct order
3. Updating all necessary files
4. Testing thoroughly
5. Maintaining documentation

This process has been validated through features like the Constellation Format and provides a reliable framework for future enhancements.