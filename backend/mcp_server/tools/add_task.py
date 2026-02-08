"""
MCP Tool: add_task
Purpose: Create new task for the user
"""

from pydantic import Field
from typing import Dict, Any
from database import get_session_context
from sqlmodel import Session


async def add_task(
    user_id: str = Field(description="User's ID from JWT context"),
    title: str = Field(
        description="Task title (required, max 200 chars)", min_length=1, max_length=200
    ),
    description: str = Field(
        description="Optional task description (max 1000 chars)",
        max_length=1000,
        default="",
    ),
) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        user_id: User's ID from JWT context
        title: Task title (required, max 200 chars)
        description: Optional task description (max 1000 chars)

    Returns:
        dict: {task_id, title, status, message}
    """
    try:
        # Validate inputs for empty title
        if not title or len(title.strip()) == 0:
            return {"error": "Title cannot be empty", "status": "error"}

        # Use the existing database session context
        with get_session_context() as db:
            # Import TaskService
            from services.task_service import TaskService

            task_service = TaskService()

            # Prepare task data
            from schemas.task_schemas import TaskCreate

            task_create = TaskCreate(
                title=title.strip(), description=description.strip()
            )

            # Call existing TaskService
            task = task_service.create_task(user_id=user_id, task=task_create, db=db)

            # Return MCP-compliant response
            return {
                "task_id": task.id,
                "title": task.title,
                "status": "created",
                "message": f"Task '{task.title}' created successfully",
            }

    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return {"error": f"Database error: {str(e)}", "status": "error"}
        return {"error": f"Unexpected error: {str(e)}", "status": "error"}
