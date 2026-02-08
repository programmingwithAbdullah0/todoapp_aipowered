from datetime import timedelta
from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from schemas.user_schemas import UserCreate, UserRead, Token
from auth.jwt import create_access_token
from services.user_service import UserService
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


router = APIRouter()


@router.post("/auth/sign-up/email", response_model=UserRead)
async def signup(user: UserCreate, db: Session = Depends(get_session)):
    """Register a new user."""
    return UserService.create_user(user, db)


@router.post("/auth/sign-in/email", response_model=Token)
async def login(credentials: LoginRequest, db: Session = Depends(get_session)):
    """Authenticate user and return JWT token."""
    user = UserService.authenticate_user(credentials.email, credentials.password, db)

    # Create access token
    access_token_expires = timedelta(days=7)  # 7 days as specified in spec
    access_token = create_access_token(
        data={"sub": user.id},  # Using user.id as the subject
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/auth/sign-out")
async def sign_out():
    """Sign out user (client-side only for JWT)."""
    return {"message": "Signed out successfully"}
