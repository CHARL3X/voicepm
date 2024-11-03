from typing import List
from pydantic import BaseModel

class RoadmapSection(BaseModel):
    title: str
    priority: str
    timeline: str
    content: List[str]

class StrategicRoadmap(BaseModel):
    market_analysis: List[RoadmapSection]
    resource_requirements: List[RoadmapSection]
    dependencies: List[RoadmapSection]
    milestones: List[RoadmapSection]
    success_metrics: List[RoadmapSection]
    summary: str
