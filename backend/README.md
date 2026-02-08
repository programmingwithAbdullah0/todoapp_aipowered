# Backend - TodoFlow AI Assistant

This is the FastAPI backend for the Phase III Todo application. It handles core task management logic and integrates the AI assistant layer via MCP tools.

## Architecture

### 1. Core API (`/main.py` & `/routes`)

- **FastAPI**: Provides the REST endpoints for task CRUD and AI chat.
- **Stateless Chat**: The `/chat` endpoint accepts historical messages from the frontend to maintain context without session storage.

### 2. Service Layer (`/services`)

- **`TaskService`**: The "Source of Truth" for task operations. Handles database interaction through SQLModel.
- **`ChatService`**: Orchestrates the AI Agent, providing instructions and registering tools.

### 3. Model Context Protocol (`/mcp_server`)

This folder contains the standardized tool definitions that the AI Assistant uses to interact with your tasks.

- **Tools**: located in [tools/](file:///e:/Abdul%20samad%20codes/Hackhaton/GIAIC_Hackhatons/Q4_Specs_Driven_Developement/hackathon-II-todo/phase-III/backend/mcp_server/tools), these functions are shared between the internal Agent and the external MCP server.
- **Tool Utils**: Shared logic for identifying tasks by ID or Title.

---

## Environment Variables

Required variables in `.env`:

- `DATABASE_URL`: Your database connection string (default: sqlite:///./test.db for local development).
- `SECRET_KEY`: Used for JWT signing.
- `GEMINI_API_KEY`: For the AI Assistant (Google AI).
- `FRONTEND_URL`: URL to avoid CORS issues (default: http://localhost:3000).
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials
  - Redirect URI: `http://localhost:8000/api/auth/github/callback`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
  - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`

---

## Development

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (Highly Recommended)

### Installation

```bash
# Using uv (Recommended)
uv sync

# Using pip
pip install -r requirements.txt
```

### Running the App

```bash
# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### Running MCP Separately

```bash
python mcp_server/start_server.py
```

## Database Migrations

This phase uses **SQLModel** with automatic table creation in `database.py`. Ensure your `DATABASE_URL` is correct before starting.
