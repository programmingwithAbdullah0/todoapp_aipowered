from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from schemas.user_schemas import UserRead
from services.user_service import UserService
from dependencies.auth import get_current_user
from models.user import User

router = APIRouter()


@router.get("/users/me", response_model=UserRead)
async def get_current_user_profile(
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get current user profile."""
    user = db.get(User, current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
