"""
MCP Tool: complete_task
Purpose: Mark a task as complete by ID or title
"""

from pydantic import Field
from typing import Dict, Any, Optional
from database import get_session_context


async def complete_task(
    user_id: str = Field(description="User's ID from JWT context"),
    task_id: Optional[int] = Field(description="Task ID to complete", default=None),
    task_title: Optional[str] = Field(
        description="Task title to search for (if task_id not provided)", default=None
    ),
) -> Dict[str, Any]:
    """
    Mark a task as complete by ID or title.

    Args:
        user_id: User's ID from JWT context
        task_id: Task ID to complete (optional if task_title provided)
        task_title: Task title to search for (optional if task_id provided)

    Returns:
        dict: {task_id, title, completed, status} or {error, status} or {disambiguation, matches, status}
    """
    try:
        # Validate that at least one identifier is provided
        if task_id is None and not task_title:
            return {
                "error": "Please provide either a task ID or task title to complete",
                "status": "error",
            }

        with get_session_context() as db:
            from services.task_service import TaskService
            from schemas.task_schemas import TaskToggleComplete
            from mcp_server.tool_utils import resolve_task

            # Resolve the task using shared logic
            task, error_response = resolve_task(user_id, db, task_id, task_title)
            if error_response:
                return error_response

            # Mark complete
            task_service = TaskService()
            task_toggle = TaskToggleComplete(completed=True)
            updated_task = task_service.toggle_task_complete(
                user_id, task.id, task_toggle, db
            )

            result = {
                "task_id": updated_task.id,
                "title": updated_task.title,
                "completed": updated_task.completed,
                "status": "completed",
            }
            
            # Notify that a task was updated (completion status changed)
            try:
                from utils.event_broadcaster import broadcaster
                import asyncio
                
                # Create a task to notify users asynchronously without blocking
                async def notify_task_completed():
                    await broadcaster.notify_user(
                        user_id, 
                        "task_updated", 
                        {"task_id": updated_task.id, "title": updated_task.title, "completed": updated_task.completed}
                    )
                
                # Schedule the notification to run without blocking
                if asyncio.get_event_loop().is_running():
                    asyncio.create_task(notify_task_completed())
            except:
                # If broadcaster is not available, continue without error
                pass
            
            return result

    except Exception as e:
        from sqlalchemy.exc import SQLAlchemyError

        if isinstance(e, SQLAlchemyError):
            return {"error": f"Database error: {str(e)}", "status": "error"}
        return {"error": f"Unexpected error: {str(e)}", "status": "error"}
