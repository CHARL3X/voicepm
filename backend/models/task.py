from typing import List
from pydantic import BaseModel

class Task(BaseModel):
    title: str
    priority: str
    description: str | None = None

class ProcessedOutput(BaseModel):
    tasks: List[Task]
    next_steps: List[str]
    notes: List[str]
