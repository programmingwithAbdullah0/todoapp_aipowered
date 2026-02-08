"""
MCP Tool: list_tasks
Purpose: List user's tasks with optional filtering
"""

from pydantic import Field
from typing import Dict, Any, List
from database import get_session_context
from sqlmodel import select


async def list_tasks(
    user_id: str = Field(description="User's ID from JWT context"),
    status: str = Field(description="Filter by status", default="all"),
) -> Dict[str, Any]:
    """
    List tasks for the user with optional filtering.

    Args:
        user_id: User's ID from JWT context
        status: Filter by status - "all", "pending", or "completed"

    Returns:
        dict: {tasks, count, status}
    """
    try:
        # Validate status parameter
        if status not in ["all", "pending", "completed"]:
            return {
                "error": "Status must be 'all', 'pending', or 'completed'",
                "status": "error",
            }

        # Use the existing database session context
        with get_session_context() as db:
            # Import Task model
            from models.task import Task

            # Use SQLModel's select instead of session.query
            statement = select(Task).where(Task.user_id == user_id)

            # Apply status filter at the database level
            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)

            filtered_tasks = db.exec(statement).all()

            # Format tasks for MCP response - serialize WITHIN the session context
            tasks_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": (
                        task.created_at.isoformat()
                        if hasattr(task, "created_at") and task.created_at
                        else None
                    ),
                }
                for task in filtered_tasks
            ]

            return {"tasks": tasks_list, "count": len(tasks_list), "status": "success"}

    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return {"error": f"Database error: {str(e)}", "status": "error"}
        return {"error": f"Unexpected error: {str(e)}", "status": "error"}
