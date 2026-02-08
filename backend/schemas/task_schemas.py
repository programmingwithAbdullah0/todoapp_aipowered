from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class TaskCreate(TaskBase):
    title: str
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskToggleComplete(BaseModel):
    completed: bool