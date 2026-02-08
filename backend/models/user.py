from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

# Import schemas to maintain backward compatibility for routes importing from models
from schemas.user_schemas import UserCreate, UserRead, UserUpdate


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    name: Optional[str] = Field(default=None)


class User(UserBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: Optional[str] = Field(
        default=None, nullable=True
    )  # Optional for OAuth users
    oauth_provider: Optional[str] = Field(
        default=None, nullable=True
    )  # 'google', 'github', or None
    oauth_provider_id: Optional[str] = Field(
        default=None, nullable=True
    )  # Unique ID from OAuth provider
    avatar_url: Optional[str] = Field(
        default=None, nullable=True
    )  # Profile picture URL
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
