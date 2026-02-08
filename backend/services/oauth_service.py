from typing import Optional, Dict, Any
from sqlmodel import Session, select
from models.user import User
from settings import settings
import httpx
import uuid
from fastapi import HTTPException


class OAuthService:
    """Service for handling OAuth authentication flows."""

    @staticmethod
    def get_github_oauth_url(redirect_uri: str) -> str:
        """Generate GitHub OAuth authorization URL."""
        if not settings.github_client_id:
            raise HTTPException(
                status_code=500, detail="GitHub OAuth is not configured"
            )

        params = {
            "client_id": settings.github_client_id,
            "redirect_uri": redirect_uri,
            "scope": "read:user user:email",
        }
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"https://github.com/login/oauth/authorize?{query_string}"

    @staticmethod
    def get_google_oauth_url(redirect_uri: str) -> str:
        """Generate Google OAuth authorization URL."""
        if not settings.google_client_id:
            raise HTTPException(
                status_code=500, detail="Google OAuth is not configured"
            )

        params = {
            "client_id": settings.google_client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
        }
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"https://accounts.google.com/o/oauth2/v2/auth?{query_string}"

    @staticmethod
    async def handle_github_callback(code: str, redirect_uri: str, db: Session) -> User:
        """Handle GitHub OAuth callback and create/update user."""
        if not settings.github_client_id or not settings.github_client_secret:
            raise HTTPException(
                status_code=500, detail="GitHub OAuth is not configured"
            )

        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                },
                headers={"Accept": "application/json"},
            )
            
            # Check if the response is successful
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail=f"GitHub OAuth token exchange failed: {token_response.text}"
                )
                
            token_data = token_response.json()

            if "error" in token_data:
                error_description = token_data.get("error_description", token_data["error"])
                raise HTTPException(
                    status_code=400, detail=f"GitHub OAuth error: {error_description}"
                )

            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(
                    status_code=400, detail="No access token received from GitHub"
                )

            # Fetch user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail=f"Failed to fetch user info from GitHub: {user_response.text}"
                )
                
            github_user = user_response.json()

            # Fetch user email (primary email)
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if email_response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail=f"Failed to fetch user emails from GitHub: {email_response.text}"
                )
                
            emails = email_response.json()
            primary_email = next(
                (email["email"] for email in emails if email["primary"]), None
            )

            if not primary_email:
                raise HTTPException(
                    status_code=400, detail="No primary email found in GitHub account"
                )

            # Create or update user
            return OAuthService.get_or_create_oauth_user(
                db=db,
                email=primary_email,
                name=github_user.get("name") or github_user.get("login"),
                oauth_provider="github",
                oauth_provider_id=str(github_user["id"]),
                avatar_url=github_user.get("avatar_url"),
            )

    @staticmethod
    async def handle_google_callback(code: str, redirect_uri: str, db: Session) -> User:
        """Handle Google OAuth callback and create/update user."""
        if not settings.google_client_id or not settings.google_client_secret:
            raise HTTPException(
                status_code=500, detail="Google OAuth is not configured"
            )

        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
            
            # Check if the response is successful
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail=f"Google OAuth token exchange failed: {token_response.text}"
                )
                
            token_data = token_response.json()

            if "error" in token_data:
                error_description = token_data.get("error_description", token_data["error"])
                raise HTTPException(
                    status_code=400, detail=f"Google OAuth error: {error_description}"
                )

            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(
                    status_code=400, detail="No access token received from Google"
                )

            # Fetch user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail=f"Failed to fetch user info from Google: {user_response.text}"
                )
                
            google_user = user_response.json()

            # Create or update user
            return OAuthService.get_or_create_oauth_user(
                db=db,
                email=google_user["email"],
                name=google_user.get("name"),
                oauth_provider="google",
                oauth_provider_id=google_user["id"],
                avatar_url=google_user.get("picture"),
            )

    @staticmethod
    def get_or_create_oauth_user(
        db: Session,
        email: str,
        name: Optional[str],
        oauth_provider: str,
        oauth_provider_id: str,
        avatar_url: Optional[str] = None,
    ) -> User:
        """Get existing OAuth user or create a new one."""
        # Check if user exists with this OAuth provider
        statement = select(User).where(
            User.oauth_provider == oauth_provider,
            User.oauth_provider_id == oauth_provider_id,
        )
        existing_user = db.exec(statement).first()

        if existing_user:
            # Update user info if needed
            existing_user.name = name or existing_user.name
            existing_user.avatar_url = avatar_url or existing_user.avatar_url
            db.add(existing_user)
            db.commit()
            db.refresh(existing_user)
            return existing_user

        # Check if user exists with same email
        statement = select(User).where(User.email == email)
        email_user = db.exec(statement).first()

        if email_user:
            # Link OAuth provider to existing email account
            if email_user.oauth_provider is None:
                email_user.oauth_provider = oauth_provider
                email_user.oauth_provider_id = oauth_provider_id
                email_user.avatar_url = avatar_url or email_user.avatar_url
                db.add(email_user)
                db.commit()
                db.refresh(email_user)
                return email_user
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Email already registered with {email_user.oauth_provider}",
                )

        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            email=email,
            name=name,
            oauth_provider=oauth_provider,
            oauth_provider_id=oauth_provider_id,
            avatar_url=avatar_url,
            password_hash=None,  # OAuth users don't have passwords
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
