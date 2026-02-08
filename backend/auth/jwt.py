from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from settings import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token with expiration."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.jwt_expiration_days)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise JWTError("Could not validate credentials")
        return payload
    except JWTError as e:
        raise JWTError(f"Could not validate credentials: {str(e)}")


def decode_token(token: str) -> dict:
    """
    Decode a JWT token without validation.
    DANGER: This is for debugging purposes ONLY. Do not use in production.
    """
    if not settings.debug:
        raise RuntimeError(
            "decode_token is for debugging only and is disabled in production."
        )
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=["HS256"],
        options={"verify_signature": False},
    )
