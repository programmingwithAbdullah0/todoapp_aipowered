from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import datetime


class ChatMessageSchema(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    history: Optional[List[ChatMessageSchema]] = None


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    timestamp: datetime.datetime
