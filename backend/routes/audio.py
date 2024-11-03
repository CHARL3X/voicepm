import os
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from openai import OpenAI
from models import ProcessedOutput, StrategicRoadmap, ProcessDocument
from services import (
    process_transcript_to_tasks,
    process_transcript_to_roadmap,
    process_transcript_to_process_doc
)
from utils import get_demo_tasks, get_demo_roadmap, get_demo_process_doc

router = APIRouter()

@router.post("/process-audio", response_model=ProcessedOutput)
async def process_audio_to_tasks(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into tasks and return structured information."""
    if not file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an audio file"
        )
    
    if request.app.state.demo_mode:
        return get_demo_tasks()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
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
        structured_data = await process_transcript_to_tasks(transcript.text, request.app.state.openrouter_client)
        
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

@router.post("/process-audio/roadmap", response_model=StrategicRoadmap)
async def process_audio_to_roadmap(
    request: Request,
    file: UploadFile = File(...)
):
    """Process an audio file into a strategic roadmap."""
    if not file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an audio file"
        )
    
    if request.app.state.demo_mode:
        return get_demo_roadmap()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
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
        structured_data = await process_transcript_to_roadmap(transcript.text, request.app.state.openrouter_client)
        
        return StrategicRoadmap(**structured_data)
        
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
    if not file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an audio file"
        )
    
    if request.app.state.demo_mode:
        return get_demo_process_doc()
    
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
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
            
        # Step 2: Process transcript into process doc
        structured_data = await process_transcript_to_process_doc(transcript.text, request.app.state.openrouter_client)
        
        return ProcessDocument(**structured_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
