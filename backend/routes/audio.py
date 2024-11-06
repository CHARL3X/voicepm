import os
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from openai import OpenAI
from models import ProcessedOutput, StrategicRoadmap, ProcessDocument, ConstellationOutput
from services import (
    process_transcript_to_tasks,
    process_transcript_to_roadmap,
    process_transcript_to_process_doc
)
from utils import get_demo_tasks, get_demo_roadmap, get_demo_process_doc, get_demo_constellation
from services.constellation import ConstellationService

router = APIRouter()

ALLOWED_MIME_TYPES = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/x-m4a',  # Added for iOS M4A support
    'audio/m4a'     # Alternative M4A MIME type
]

@router.post("/process-audio", response_model=ProcessedOutput)
async def process_audio_to_tasks(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into tasks and return structured information."""
    # Enhanced MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload MP3, M4A, or WAV files. Received: {file.content_type}"
        )
    
    # Check file size (25MB limit)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 25 * 1024 * 1024:  # 25MB in bytes
        raise HTTPException(
            status_code=400,
            detail="File size must be under 25MB"
        )
    
    if request.app.state.demo_mode:
        return get_demo_tasks()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # Step 1: Transcribe audio using OpenAI's Whisper
        try:
            with open(temp_path, "rb") as audio_file:
                transcript = request.app.state.openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error transcribing audio: {str(e)}"
            )
            
        # Step 2: Process transcript into tasks
        try:
            structured_data = await process_transcript_to_tasks(transcript.text, request.app.state.openrouter_client)
            return ProcessedOutput(**structured_data)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing transcript: {str(e)}"
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/process-audio/roadmap", response_model=StrategicRoadmap)
async def process_audio_to_roadmap(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into a strategic roadmap."""
    # Enhanced MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload MP3, M4A, or WAV files. Received: {file.content_type}"
        )
    
    # Check file size (25MB limit)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 25 * 1024 * 1024:  # 25MB in bytes
        raise HTTPException(
            status_code=400,
            detail="File size must be under 25MB"
        )
    
    if request.app.state.demo_mode:
        return get_demo_roadmap()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # Step 1: Transcribe audio using OpenAI's Whisper
        try:
            with open(temp_path, "rb") as audio_file:
                transcript = request.app.state.openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error transcribing audio: {str(e)}"
            )
            
        # Step 2: Process transcript into roadmap
        try:
            structured_data = await process_transcript_to_roadmap(transcript.text, request.app.state.openrouter_client)
            return StrategicRoadmap(**structured_data)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing transcript: {str(e)}"
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/process-audio/process", response_model=ProcessDocument)
async def process_audio_to_process_doc(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into a process document."""
    # [Existing implementation remains unchanged]

@router.post("/process-audio/constellation", response_model=ConstellationOutput)
async def process_audio_to_constellation(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into a constellation format."""
    # Enhanced MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload MP3, M4A, or WAV files. Received: {file.content_type}"
        )
    
    # Check file size (25MB limit)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 25 * 1024 * 1024:  # 25MB in bytes
        raise HTTPException(
            status_code=400,
            detail="File size must be under 25MB"
        )
    
    if request.app.state.demo_mode:
        return get_demo_constellation()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # Step 1: Transcribe audio using OpenAI's Whisper
        try:
            with open(temp_path, "rb") as audio_file:
                transcript = request.app.state.openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error transcribing audio: {str(e)}"
            )
            
        # Step 2: Process transcript into constellation format
        try:
            constellation_service = ConstellationService(request.app.state.openrouter_client)
            structured_data = await constellation_service.process_transcript(transcript.text)
            return ConstellationOutput(**structured_data)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing transcript: {str(e)}"
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
