import json
from fastapi import HTTPException
from openai import OpenAI
from prompts import TASK_SYSTEM_PROMPT, ROADMAP_SYSTEM_PROMPT, PROCESS_SYSTEM_PROMPT

def create_openrouter_client(api_key: str) -> OpenAI:
    """Create an OpenRouter client."""
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
        default_headers={
            "HTTP-Referer": "https://voxify.app",
            "X-Title": "Voxify"
        }
    )

async def process_transcript_to_tasks(transcript: str, openrouter_client: OpenAI) -> dict:
    """Process the transcript into tasks using Claude 3.5 Sonnet."""
    try:
        response = openrouter_client.chat.completions.create(
            model="anthropic/claude-3.5-sonnet",
            messages=[
                {
                    "role": "system",
                    "content": TASK_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"""Analyze this voice memo transcript and extract tasks, next steps, and important notes. 
                    Focus on creating a clear, actionable project plan while preserving the context and relationships between ideas.
                    
                    Transcript:
                    {transcript}"""
                }
            ]
        )
        
        # Extract JSON from response
        response_text = response.choices[0].message.content
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in response")
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing transcript: {str(e)}"
        )

async def process_transcript_to_roadmap(transcript: str, openrouter_client: OpenAI) -> dict:
    """Process the transcript into a strategic roadmap using Claude 3.5 Sonnet."""
    try:
        response = openrouter_client.chat.completions.create(
            model="anthropic/claude-3.5-sonnet",
            messages=[
                {
                    "role": "system",
                    "content": ROADMAP_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"""Analyze this voice memo transcript and create a strategic roadmap. 
                    Focus on extracting key strategic elements and organizing them into a comprehensive plan.
                    
                    Transcript:
                    {transcript}"""
                }
            ]
        )
        
        # Extract JSON from response
        response_text = response.choices[0].message.content
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in response")
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing transcript: {str(e)}"
        )

async def process_transcript_to_process_doc(transcript: str, openrouter_client: OpenAI) -> dict:
    """Process the transcript into a process document using Claude 3.5 Sonnet."""
    try:
        response = openrouter_client.chat.completions.create(
            model="anthropic/claude-3.5-sonnet",
            messages=[
                {
                    "role": "system",
                    "content": PROCESS_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"""Convert this voice memo transcript into a clear process document. 
                    Focus on extracting sequential steps, prerequisites, and important details while maintaining clarity.
                    
                    Transcript:
                    {transcript}"""
                }
            ]
        )
        
        # Extract JSON from response
        response_text = response.choices[0].message.content
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in response")
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing transcript: {str(e)}"
        )
