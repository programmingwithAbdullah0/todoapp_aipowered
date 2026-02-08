from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from settings import settings
from routes import tasks, auth, oauth, users, conversation
from database import engine
from sqlmodel import SQLModel
import time
from fastapi.exceptions import RequestValidationError
from fastapi.requests import Request
from fastapi.responses import JSONResponse


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        return response


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title=settings.app_name, debug=settings.debug, version="1.0.0")

    # Add security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            settings.frontend_url
        ],  # Restrict to your frontend's domain in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(tasks.router, prefix=settings.api_prefix, tags=["tasks"])
    app.include_router(auth.router, prefix=settings.api_prefix, tags=["auth"])
    app.include_router(oauth.router, prefix=settings.api_prefix, tags=["oauth"])
    app.include_router(users.router, prefix=settings.api_prefix, tags=["users"])
    app.include_router(conversation.router, prefix=settings.api_prefix, tags=["chat"])

    return app


# Create the main application instance
app = create_app()


@app.on_event("startup")
async def on_startup():
    """Create database tables on startup."""
    SQLModel.metadata.create_all(bind=engine)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    print(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
