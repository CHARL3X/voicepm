from typing import List, Dict
from pydantic import BaseModel

class ProcessStep(BaseModel):
    """A single step in a process document."""
    number: int
    action: str
    details: str
    outcome: str

class ProcessDocument(BaseModel):
    """A structured process documentation."""
    title: str
    overview: str
    prerequisites: List[str]
    steps: List[ProcessStep]
    notes: List[str]
