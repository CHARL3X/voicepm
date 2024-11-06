# VoicePM Backend Feature Implementation Guide

## Overview
This guide provides a comprehensive walkthrough of implementing new features in the VoicePM backend, using the Constellation Format implementation as a case study. It covers the entire process from initial setup to troubleshooting common issues.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Implementation Process](#implementation-process)
3. [File Dependencies](#file-dependencies)
4. [Common Pitfalls](#common-pitfalls)
5. [Case Study: Constellation Format](#case-study-constellation-format)

## Architecture Overview

### Core Components
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

## Implementation Process

### 1. Planning Phase
- Define the feature's data structure
- Identify required components
- Map dependencies and interactions
- Consider frontend integration points

### 2. Implementation Order
1. **Define Models**
   - Create Pydantic models first
   - Include field validations
   - Add comprehensive documentation
   - Example:
     ```python
     class ConstellationOutput(BaseModel):
         title: str = Field(..., description="Title")
         summary: str = Field(..., description="Summary")
         # Additional fields...
     ```

2. **Create Service Layer**
   - Implement processing logic
   - Handle external API calls
   - Include error handling
   - Example:
     ```python
     class ConstellationService:
         async def process_transcript(self, transcript: str):
             # Processing logic...
     ```

3. **Add Demo Support**
   - Create demo data generator
   - Match production data structure
   - Include realistic sample data
   - Example:
     ```python
     def get_demo_constellation():
         return {
             "title": "Sample Title",
             # Demo data...
         }
     ```

4. **Update Route Handlers**
   - Add new endpoints
   - Implement request validation
   - Connect to services
   - Example:
     ```python
     @router.post("/process-audio/constellation")
     async def process_audio_to_constellation(file: UploadFile):
         # Endpoint logic...
     ```

5. **Update Package Exports**
   - Add models to __init__.py
   - Export utility functions
   - Update service registrations
   - Example:
     ```python
     from .constellation import ConstellationOutput
     __all__ = ['ConstellationOutput', ...]
     ```

### 3. Integration Points

#### Frontend Integration
- Update audio handler endpoints
- Add format-specific handlers
- Implement visualization components
- Example:
  ```javascript
  const endpoints = {
      constellation: '/process-audio/constellation',
      // Other endpoints...
  };
  ```

## File Dependencies

### Critical Path
1. `models/[feature].py` → Define data structures
2. `models/__init__.py` → Export models
3. `utils/demo_[feature].py` → Create demo data
4. `utils/__init__.py` → Export utilities
5. `services/[feature].py` → Implement logic
6. `routes/audio.py` → Add endpoints

### Import Chain
```
routes/audio.py
  ↳ services/[feature].py
    ↳ models/[feature].py
    ↳ prompts/[feature]_prompt.py
    ↳ utils/demo_[feature].py
```

## Common Pitfalls

### 1. Import Issues
- **Problem**: Relative imports failing
- **Solution**: Use absolute imports from project root
  ```python
  # Instead of:
  from ..models import Feature
  # Use:
  from models import Feature
  ```

### 2. Pydantic V2 Compatibility
- **Problem**: Deprecated config options
- **Solution**: Update to new syntax
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
       # Additional fields...
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

## Best Practices

1. **Documentation**
   - Document all models and functions
   - Include usage examples
   - Explain complex logic

2. **Error Handling**
   - Use specific error types
   - Provide helpful messages
   - Include fallback behavior

3. **Testing**
   - Write unit tests
   - Test error cases
   - Verify demo mode

4. **Code Organization**
   - Follow consistent patterns
   - Keep files focused
   - Use clear naming

## Conclusion

Adding new features to the VoicePM backend requires careful attention to the interdependencies between components. Following this guide ensures a smooth implementation process and maintains code quality and consistency.

Remember to:
1. Plan the feature structure
2. Implement in the correct order
3. Update all necessary files
4. Test thoroughly
5. Document changes

This process has been battle-tested through features like the Constellation Format and provides a reliable framework for future enhancements.
