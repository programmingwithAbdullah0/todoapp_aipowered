from sqlmodel import Session
from models.user import User
from schemas.user_schemas import UserCreate
from utils.errors import InvalidCredentialsException, UserAlreadyExistsException
import bcrypt
import uuid
import time


class UserService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                (
                    hashed_password.encode("ascii")
                    if isinstance(hashed_password, str)
                    else hashed_password
                ),
            )
        except ValueError:
            return False

    @staticmethod
    def get_password_hash(password: str) -> str:
        # Generate salt and hash
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("ascii")

    @staticmethod
    def create_user(user: UserCreate, db: Session) -> User:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise UserAlreadyExistsException(user.email)

        hashed_password = UserService.get_password_hash(user.password)

        db_user = User(
            id=str(uuid.uuid4()),
            email=user.email,
            name=user.name,
            password_hash=hashed_password,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(email: str, password: str, db: Session) -> User:
        user = db.query(User).filter(User.email == email).first()

        # Check if user exists
        if not user:
            # Add a small delay to prevent timing attacks
            time.sleep(0.1)
            raise InvalidCredentialsException()

        # Check if user is OAuth-only (no password)
        if user.oauth_provider and not user.password_hash:
            raise InvalidCredentialsException(
                f"This account uses {user.oauth_provider} login. Please sign in with {user.oauth_provider}."
            )

        # Verify password for traditional login
        if not user.password_hash or not UserService.verify_password(
            password, user.password_hash
        ):
            # Add a small delay to prevent timing attacks
            time.sleep(0.1)
            raise InvalidCredentialsException()

        return user
