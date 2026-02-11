import logging
import re
from ai import get_chat_completion, get_task_client  # Import the get_chat_completion function from ai module
from models.chat import ChatRequest
from sqlmodel import Session
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        # Instructions for the AI assistant
        self.instructions = """You are a helpful assistant. You can help users manage their tasks by adding, completing, deleting, or viewing tasks. When users ask to perform task operations, I will handle those operations separately and let you know the results. Just respond naturally to the user's request."""

    async def process_message(
        self, request: ChatRequest, user_id: str, session: Session
    ) -> str:
        try:
            # Parse the message for the exact operations required
            message_lower = request.message.lower().strip()
            
            # Add task pattern: "add task buy groceries tomorrow high priority"
            add_match = re.search(r'^add task (.+?)(?: tomorrow)?(?: high priority)?$', message_lower)
            if add_match:
                title = add_match.group(1).strip()
                try:
                    task_client = get_task_client()
                    result = await task_client.add_task(user_id=user_id, title=title)
                    # Dispatch event to update frontend
                    try:
                        import asyncio
                        from utils.event_broadcaster import broadcaster
                        
                        async def notify_task_added():
                            await broadcaster.notify_user(
                                user_id,
                                "task_created",
                                {"task_id": result.get("id"), "title": result.get("title"), "completed": result.get("completed", False)}
                            )
                        
                        if asyncio.get_event_loop().is_running():
                            asyncio.create_task(notify_task_added())
                    except:
                        pass  # If broadcaster is not available, continue without error
                    
                    return f"Task added: {result.get('title', title)}"
                except Exception as e:
                    return f"Error adding task: {str(e)}"
            
            # Update task by ID: "update task ID 5 change title to gym at 7pm"
            update_id_match = re.search(r'^update task id (\d+) change title to (.+)$', message_lower)
            if update_id_match:
                task_id = int(update_id_match.group(1))
                new_title = update_id_match.group(2).strip()
                try:
                    task_client = get_task_client()
                    result = await task_client.update_task(user_id=user_id, task_id=task_id, title=new_title)
                    return f"Task {task_id} updated: {new_title}"
                except Exception as e:
                    return f"Error updating task: {str(e)}"
            
            # Edit task: "edit task buy milk set status completed"
            edit_match = re.search(r'^edit task (.+?) set status (completed|done)$', message_lower)
            if edit_match:
                task_name = edit_match.group(1).strip()
                try:
                    # For this operation, we need to find the task by name first
                    # Using the existing task service to find by title
                    from services.task_service import TaskService
                    from database import get_session_context
                    
                    with get_session_context() as db_session:
                        tasks = TaskService.get_tasks_by_title(user_id, task_name, db_session)
                        if tasks:
                            task = tasks[0]  # Take the first match
                            task_client = get_task_client()
                            result = await task_client.complete_task(user_id=user_id, task_id=task.id)
                            return f"Task '{task_name}' marked as completed"
                        else:
                            return f"Task '{task_name}' not found"
                except Exception as e:
                    return f"Error editing task: {str(e)}"
            
            # Delete task by ID: "delete task ID 3"
            delete_id_match = re.search(r'^delete task id (\d+)$', message_lower)
            if delete_id_match:
                task_id = int(delete_id_match.group(1))
                try:
                    task_client = get_task_client()
                    result = await task_client.delete_task(user_id=user_id, task_id=task_id)
                    return f"Task {task_id} deleted successfully"
                except Exception as e:
                    return f"Error deleting task: {str(e)}"
            
            # Delete task by ID using #: "#5 delete" or "delete #5"
            delete_hash_match = re.search(r'(?:^|\s)#(\d+)(?:\s|$)|^delete\s+#(\d+)$', message_lower)
            if delete_hash_match:
                task_id = int(delete_hash_match.group(1) or delete_hash_match.group(2))
                try:
                    task_client = get_task_client()
                    result = await task_client.delete_task(user_id=user_id, task_id=task_id)
                    return f"Task #{task_id} deleted successfully"
                except Exception as e:
                    return f"Error deleting task: {str(e)}"
            
            # Delete task by name: "delete task clean room"
            delete_name_match = re.search(r'^delete task (.+)$', message_lower)
            if delete_name_match:
                task_name = delete_name_match.group(1).strip()
                try:
                    # Find the task by name first
                    from services.task_service import TaskService
                    from database import get_session_context
                    
                    with get_session_context() as db_session:
                        tasks = TaskService.get_tasks_by_title(user_id, task_name, db_session)
                        if tasks:
                            task = tasks[0]  # Take the first match
                            task_client = get_task_client()
                            result = await task_client.delete_task(user_id=user_id, task_id=task.id)
                            return f"Task '{task_name}' deleted successfully"
                        else:
                            return f"Task '{task_name}' not found"
                except Exception as e:
                    return f"Error deleting task: {str(e)}"
            
            # Delete task by name (alternative format): "delete 'clean room'"
            delete_quoted_match = re.search(r"^delete\s+'([^']+)'$", message_lower)
            if delete_quoted_match:
                task_name = delete_quoted_match.group(1).strip()
                try:
                    # Find the task by name first
                    from services.task_service import TaskService
                    from database import get_session_context
                    
                    with get_session_context() as db_session:
                        tasks = TaskService.get_tasks_by_title(user_id, task_name, db_session)
                        if tasks:
                            task = tasks[0]  # Take the first match
                            task_client = get_task_client()
                            result = await task_client.delete_task(user_id=user_id, task_id=task.id)
                            return f"Task '{task_name}' deleted successfully"
                        else:
                            return f"Task '{task_name}' not found"
                except Exception as e:
                    return f"Error deleting task: {str(e)}"
            
            # Mark task as complete: "mark task gym as done"
            mark_match = re.search(r'^mark task (.+?) as (done|completed)$', message_lower)
            if mark_match:
                task_name = mark_match.group(1).strip()
                try:
                    # Find the task by name first
                    from services.task_service import TaskService
                    from database import get_session_context
                    
                    with get_session_context() as db_session:
                        tasks = TaskService.get_tasks_by_title(user_id, task_name, db_session)
                        if tasks:
                            task = tasks[0]  # Take the first match
                            task_client = get_task_client()
                            result = await task_client.complete_task(user_id=user_id, task_id=task.id)
                            return f"Task '{task_name}' marked as done"
                        else:
                            return f"Task '{task_name}' not found"
                except Exception as e:
                    return f"Error marking task as done: {str(e)}"
            
            # Default to regular chat if no task operation detected
            history_context = "\nChat History:\n"
            if request.history:
                for msg in request.history:
                    role_label = "assistant" if msg.role == "assistant" else "user"
                    history_context += f"{role_label}: {msg.content}\n"

            messages = [
                {"role": "system", "content": self.instructions},
                {"role": "user", "content": f"{history_context}\nUser: {request.message}"}
            ]

            response = await get_chat_completion(messages, model="mistralai/mistral-7b-instruct")
            return response

        except Exception as e:
            logger.error(f"Error in ChatService: {e}")
            raise e
