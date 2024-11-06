"""Constellation format processing service"""

import json
from typing import Dict, Any

from models.constellation import ConstellationOutput
from prompts.constellation_prompt import CONSTELLATION_SYSTEM_PROMPT, CONSTELLATION_USER_PROMPT
from utils.demo_constellation import get_demo_constellation

class ConstellationService:
    """Service for processing audio transcripts into constellation format"""
    
    def __init__(self, openrouter_client=None, demo_mode=False):
        self.client = openrouter_client
        self.demo_mode = demo_mode

    async def process_transcript(self, transcript: str) -> Dict[str, Any]:
        """
        Process a transcript into constellation format
        
        Args:
            transcript: The text transcript to process
            
        Returns:
            Dict containing the structured constellation output
        """
        if self.demo_mode:
            return get_demo_constellation()

        try:
            # Format the prompt with the transcript
            prompt = CONSTELLATION_USER_PROMPT.format(transcript=transcript)
            
            # Get completion from Claude
            response = await self.client.chat.completions.create(
                model="anthropic/claude-3-sonnet-20240229",
                messages=[
                    {"role": "system", "content": CONSTELLATION_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            # Extract and parse the JSON response
            result = json.loads(response.choices[0].message.content)
            
            # Validate against our Pydantic model
            validated_output = ConstellationOutput(**result)
            
            return validated_output.dict()
            
        except Exception as e:
            print(f"Error processing constellation format: {str(e)}")
            # Fallback to demo data in case of error
            return get_demo_constellation()

    def _extract_patterns(self, transcript: str) -> Dict[str, Any]:
        """
        Extract patterns from the transcript
        
        Args:
            transcript: The text to analyze
            
        Returns:
            Dict containing extracted patterns
        """
        patterns = {
            "sentiment_patterns": [],
            "decision_flows": [],
            "topic_threads": [],
            "role_assignments": []
        }
        
        # Sentiment pattern detection
        positive_markers = ["great", "good", "excellent", "perfect"]
        negative_markers = ["issue", "problem", "concern", "difficult"]
        neutral_markers = ["okay", "fine", "alright"]
        
        words = transcript.lower().split()
        
        # Simple sentiment analysis
        for sentiment, markers in [
            ("positive", positive_markers),
            ("negative", negative_markers),
            ("neutral", neutral_markers)
        ]:
            found_markers = [word for word in words if word in markers]
            if found_markers:
                patterns["sentiment_patterns"].append({
                    "type": sentiment,
                    "markers": found_markers,
                    "confidence": 0.8 if len(found_markers) > 1 else 0.6
                })
        
        return patterns

    def _identify_dependencies(self, transcript: str) -> list:
        """
        Identify dependencies in the transcript
        
        Args:
            transcript: The text to analyze
            
        Returns:
            List of identified dependencies
        """
        dependencies = []
        
        # Common dependency markers
        dependency_markers = [
            "needs", "requires", "depends on", "after", "before",
            "must have", "necessary for", "contingent on"
        ]
        
        # Simple dependency detection
        sentences = transcript.split('.')
        for sentence in sentences:
            for marker in dependency_markers:
                if marker in sentence.lower():
                    parts = sentence.lower().split(marker)
                    if len(parts) == 2:
                        dependencies.append({
                            "type": "explicit",
                            "source": parts[0].strip(),
                            "target": parts[1].strip(),
                            "description": sentence.strip()
                        })
        
        return dependencies

    def _extract_timeline(self, transcript: str) -> list:
        """
        Extract timeline markers from the transcript
        
        Args:
            transcript: The text to analyze
            
        Returns:
            List of timeline markers
        """
        timeline = []
        
        # Common time indicators
        time_indicators = [
            "today", "tomorrow", "next week", "next month",
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ]
        
        sentences = transcript.split('.')
        for sentence in sentences:
            for indicator in time_indicators:
                if indicator in sentence.lower():
                    timeline.append({
                        "date": indicator.title(),
                        "title": sentence.strip(),
                        "description": None
                    })
        
        return timeline
