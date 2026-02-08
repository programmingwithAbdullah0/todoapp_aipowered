"""
MCP Tool: delete_task
Purpose: Delete a task by ID or title
"""

from pydantic import Field
from typing import Dict, Any, Optional
from database import get_session_context


async def delete_task(
    user_id: str = Field(description="User's ID from JWT context"),
    task_id: Optional[int] = Field(description="Task ID to delete", default=None),
    task_title: Optional[str] = Field(
        description="Task title to search for (if task_id not provided)", default=None
    ),
) -> Dict[str, Any]:
    """
    Delete a task by ID or title.

    Args:
        user_id: User's ID from JWT context
        task_id: Task ID to delete (optional if task_title provided)
        task_title: Task title to search for (optional if task_id provided)

    Returns:
        dict: {task_id, title, status} or {error, status} or {disambiguation, matches, status}
    """
    try:
        # Validate that at least one identifier is provided
        if task_id is None and not task_title:
            return {
                "error": "Please provide either a task ID or task title to delete",
                "status": "error",
            }

        with get_session_context() as db:
            from services.task_service import TaskService
            from mcp_server.tool_utils import resolve_task

            # Resolve the task using shared logic
            task, error_response = resolve_task(user_id, db, task_id, task_title)
            if error_response:
                return error_response

            # Perform the deletion
            task_service = TaskService()
            title = task.title
            task_service.delete_task(user_id, task.id, db)

            return {"task_id": task.id, "title": title, "status": "deleted"}

    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return {"error": f"Database error: {str(e)}", "status": "error"}
        return {"error": f"Unexpected error: {str(e)}", "status": "error"}
