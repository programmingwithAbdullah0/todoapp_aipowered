"""
MCP Tool: update_task
Purpose: Update an existing task by ID or title
"""

from pydantic import Field
from typing import Dict, Any, Optional
from database import get_session_context


async def update_task(
    user_id: str = Field(description="User's ID from JWT context"),
    task_id: Optional[int] = Field(description="Task ID to update", default=None),
    task_title: Optional[str] = Field(
        description="Task title to search for (if task_id not provided)", default=None
    ),
    title: Optional[str] = Field(
        description="New task title (max 200 chars)", max_length=200, default=None
    ),
    description: Optional[str] = Field(
        description="New task description (max 1000 chars)",
        max_length=1000,
        default=None,
    ),
) -> Dict[str, Any]:
    """
    Update an existing task by ID or title.

    Args:
        user_id: User's ID from JWT context
        task_id: Task ID to update (optional if task_title provided)
        task_title: Task title to search for (optional if task_id provided)
        title: New task title (optional, max 200 chars)
        description: New task description (optional, max 1000 chars)

    Returns:
        dict: {task_id, title, description, status} or {error, status} or {disambiguation, matches, status}
    """
    try:
        # Validate that at least one identifier is provided
        if task_id is None and not task_title:
            return {
                "error": "Please provide either a task ID or task title to update",
                "status": "error",
            }

        # Validate update fields
        if title is not None and len(title) > 200:
            return {"error": "Title must be 200 characters or less", "status": "error"}

        if description is not None and len(description) > 1000:
            return {
                "error": "Description must be 1000 characters or less",
                "status": "error",
            }

        # Build updates dict
        updates = {}
        if title is not None:
            updates["title"] = title.strip()
        if description is not None:
            updates["description"] = description.strip()

        if not updates:
            return {
                "error": "No updates provided. Please specify a new title or description.",
                "status": "error",
            }

        with get_session_context() as db:
            from services.task_service import TaskService
            from schemas.task_schemas import TaskUpdate
            from mcp_server.tool_utils import resolve_task

            # Resolve the task using shared logic
            task, error_response = resolve_task(user_id, db, task_id, task_title)
            if error_response:
                return error_response

            # Perform the update
            task_service = TaskService()
            task_update = TaskUpdate(**updates)
            updated_task = task_service.update_task(user_id, task.id, task_update, db)

            return {
                "task_id": updated_task.id,
                "title": updated_task.title,
                "description": updated_task.description,
                "status": "updated",
            }

    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return {"error": f"Database error: {str(e)}", "status": "error"}
        return {"error": f"Unexpected error: {str(e)}", "status": "error"}
