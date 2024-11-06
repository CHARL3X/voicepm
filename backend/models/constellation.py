from typing import List, Optional
from pydantic import BaseModel, Field

class SentimentPattern(BaseModel):
    """Represents detected sentiment patterns in the conversation"""
    type: str = Field(..., description="Type of sentiment (positive, neutral, negative)")
    markers: List[str] = Field(default_factory=list, description="Phrases indicating this sentiment")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of sentiment detection")

class DecisionFlow(BaseModel):
    """Tracks the evolution of decisions in the conversation"""
    initial: str = Field(..., description="Initial thought or proposal")
    progression: List[str] = Field(default_factory=list, description="Steps in decision evolution")
    final: Optional[str] = Field(None, description="Final decision or outcome")

class Dependency(BaseModel):
    """Represents dependencies between different elements"""
    type: str = Field(..., description="Type of dependency (explicit, implicit, blocking)")
    source: str = Field(..., description="Source element")
    target: str = Field(..., description="Target element")
    description: str = Field(..., description="Description of the dependency")

class TopicThread(BaseModel):
    """Tracks topics as they weave through the conversation"""
    topic: str = Field(..., description="Main topic")
    mentions: List[str] = Field(default_factory=list, description="Context of each mention")
    evolution: Optional[DecisionFlow] = Field(None, description="How the topic evolved")

class RoleAssignment(BaseModel):
    """Identifies stakeholders and their responsibilities"""
    person: str = Field(..., description="Person or role")
    assignments: List[str] = Field(default_factory=list, description="Direct assignments")
    implied_tasks: List[str] = Field(default_factory=list, description="Implied responsibilities")

class Priority(BaseModel):
    """Advanced priority scoring system"""
    score: float = Field(..., ge=0, le=1, description="Calculated priority score")
    factors: dict = Field(default_factory=dict, description="Factors influencing priority")
    signals: List[str] = Field(default_factory=list, description="Detected priority signals")

class TimelineMarker(BaseModel):
    """Represents a point in the timeline"""
    date: str = Field(..., description="Date or time reference")
    title: str = Field(..., description="Title of the milestone")
    description: Optional[str] = Field(None, description="Additional details")

class OrbitInsight(BaseModel):
    """Represents an orbital insight connected to the central theme"""
    title: str = Field(..., description="Title of the insight")
    points: List[str] = Field(default_factory=list, description="Key points")
    sentiment: Optional[str] = Field(None, description="Detected sentiment")
    priority: Optional[str] = Field(None, description="Priority level")
    dependencies: List[Dependency] = Field(default_factory=list, description="Related dependencies")

class SupportElement(BaseModel):
    """Represents questions, actions, and open items"""
    type: str = Field(..., description="Type of support element (question, action, risk)")
    content: str = Field(..., description="Content of the element")
    priority: Optional[Priority] = Field(None, description="Priority information")
    owner: Optional[str] = Field(None, description="Assigned owner")

class CentralStar(BaseModel):
    """Represents the main focus or theme"""
    title: str = Field(..., description="Title of the central theme")
    description: str = Field(..., description="Description of the central theme")
    timeline: Optional[str] = Field(None, description="Core temporal boundary")
    impact: Optional[str] = Field(None, description="Primary intended outcome")

class ConstellationOutput(BaseModel):
    """Complete constellation format output"""
    title: str = Field(..., description="Title of the constellation")
    summary: str = Field(..., description="Brief summary of the content")
    central_star: CentralStar = Field(..., description="Main theme or focus")
    orbits: List[OrbitInsight] = Field(default_factory=list, description="Connected insights")
    timeline: List[TimelineMarker] = Field(default_factory=list, description="Timeline markers")
    support: dict = Field(
        default_factory=lambda: {"questions": [], "actions": []},
        description="Support elements (questions and actions)"
    )
    
    # Pattern Recognition Elements
    sentiment_patterns: List[SentimentPattern] = Field(default_factory=list)
    decision_flows: List[DecisionFlow] = Field(default_factory=list)
    topic_threads: List[TopicThread] = Field(default_factory=list)
    role_assignments: List[RoleAssignment] = Field(default_factory=list)
    dependencies: List[Dependency] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Product Launch Strategy",
                "summary": "Team sync on Cleanse landing page and launch timeline",
                "central_star": {
                    "title": "January Product Launch",
                    "description": "Cleanse product launch with December pre-sale window",
                    "timeline": "December - January",
                    "impact": "Market entry and initial sales"
                },
                "orbits": [
                    {
                        "title": "Landing Page",
                        "points": ["Quiz reduced to 6 questions", "Four videos with thumbnails"],
                        "sentiment": "positive",
                        "priority": "high"
                    }
                ],
                "timeline": [
                    {
                        "date": "December",
                        "title": "Pre-sale Start"
                    }
                ],
                "support": {
                    "questions": ["Video shoot location?"],
                    "actions": ["Schedule video shoot"]
                }
            }
        }
    }
