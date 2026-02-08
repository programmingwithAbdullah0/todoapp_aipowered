from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(SQLModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: str
    created_at: datetime = None


class UserUpdate(SQLModel):
    name: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str
