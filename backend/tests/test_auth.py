import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel
from main import app
from database import engine
from models.user import User


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def session():
    """Create a test database session."""
    SQLModel.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session


def test_auth_routes_exist(client):
    """Test that auth routes are accessible."""
    # Test that the auth routes exist (will return 422 for missing required fields, not 404)
    response = client.post(
        "/api/auth/sign-in/email",
        json={"email": "test@example.com", "password": "password"},
    )
    # Should get 422 for validation error, not 404 for not found
    assert response.status_code in [200, 400, 422, 401]


def test_signup_route_exists(client):
    """Test that signup route exists."""
    response = client.post(
        "/api/auth/sign-up/email",
        json={"email": "test@example.com", "password": "password"},
    )
    # Should get 200 for success, 422 for validation, or 400 for existing user
    assert response.status_code in [200, 201, 400, 422]
