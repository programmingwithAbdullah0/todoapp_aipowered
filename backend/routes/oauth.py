from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse, Response
from sqlmodel import Session
from database import get_session
from services.oauth_service import OAuthService
from auth.jwt import create_access_token
from datetime import timedelta
from settings import settings

router = APIRouter()


@router.get("/auth/github")
async def github_login(request: Request):
    """Redirect to GitHub OAuth authorization page."""
    # Callback should point to THIS backend endpoint
    base_url = str(request.base_url).rstrip("/")
    redirect_uri = f"{base_url}/api/auth/github/callback"
    oauth_url = OAuthService.get_github_oauth_url(redirect_uri)
    return RedirectResponse(url=oauth_url)


@router.get("/auth/github/callback")
async def github_callback(
    code: str, request: Request, db: Session = Depends(get_session)
):
    """Handle GitHub OAuth callback."""
    base_url = str(request.base_url).rstrip("/")
    redirect_uri = f"{base_url}{request.scope['root_path']}/api/auth/github/callback"

    try:
        user = await OAuthService.handle_github_callback(code, redirect_uri, db)

        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=timedelta(days=7),
        )

        # Use URL hash fragment to pass token (not sent to server, accessible to JS)
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?provider=github#token={access_token}"
        )
    except HTTPException as e:
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?error={e.detail}"
        )
    except Exception as e:
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?error={str(e)}"
        )


@router.get("/auth/google")
async def google_login(request: Request):
    """Redirect to Google OAuth authorization page."""
    # Callback should point to THIS backend endpoint
    base_url = str(request.base_url).rstrip("/")
    redirect_uri = f"{base_url}/api/auth/google/callback"
    oauth_url = OAuthService.get_google_oauth_url(redirect_uri)
    return RedirectResponse(url=oauth_url)


@router.get("/auth/google/callback")
async def google_callback(
    code: str, request: Request, db: Session = Depends(get_session)
):
    """Handle Google OAuth callback."""
    base_url = str(request.base_url).rstrip("/")
    redirect_uri = f"{base_url}{request.scope['root_path']}/api/auth/google/callback"

    try:
        user = await OAuthService.handle_google_callback(code, redirect_uri, db)

        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=timedelta(days=7),
        )

        # Use URL hash fragment to pass token (not sent to server, accessible to JS)
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?provider=google#token={access_token}"
        )
    except HTTPException as e:
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?error={e.detail}"
        )
    except Exception as e:
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?error={str(e)}"
        )
