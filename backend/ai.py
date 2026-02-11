import os
import httpx
from openai import AsyncOpenAI
from typing import Dict, Any, Optional

# Global variable to hold the client instance
_client_instance = None


def get_client():
    """Get or create the AsyncOpenAI client with OpenRouter API configuration."""
    global _client_instance

    if _client_instance is None:
        # Get the API key from environment - this will be loaded by the main app
        OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
        if not OPENROUTER_API_KEY:
            # Try to load from .env file if not in environment
            from dotenv import load_dotenv
            load_dotenv()
            OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

        if not OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set.")

        _client_instance = AsyncOpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )

    return _client_instance


# Create a property to access the client
def client():
    return get_client()


async def get_chat_completion(messages, model="mistralai/mistral-7b-instruct"):
    """
    Get chat completion from OpenRouter model using OpenAI-compatible endpoint
    """
    client_instance = get_client()
    response = await client_instance.chat.completions.create(
        model=model,
        messages=messages
    )
    return response.choices[0].message.content


# Example usage function
async def chat_with_openrouter(prompt):
    messages = [
        {"role": "user", "content": prompt}
    ]
    return await get_chat_completion(messages)


class TaskAPIClient:
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("BACKEND_BASE_URL", "http://localhost:8000")
        self.token = None  # Will be set per request
    
    def set_token(self, token: str):
        self.token = token
    
    async def add_task(self, user_id: str, title: str, description: str = "", priority: str = "normal") -> Dict[str, Any]:
        headers = {"Content-Type": "application/json"}
        # Use the user_id as the authentication context since we're within the authenticated session
        # The routes expect a JWT token, but we're calling internally with user_id
        
        # For internal calls, we'll use the existing task service instead of HTTP calls
        # to bypass authentication issues
        from services.task_service import TaskService
        from database import get_session_context
        from schemas.task_schemas import TaskCreate
        
        with get_session_context() as db:
            task_service = TaskService()
            task_create = TaskCreate(title=title, description=description)
            task = task_service.create_task(user_id=user_id, task=task_create, db=db)
            
            # Notify that a task was created
            try:
                import asyncio
                from utils.event_broadcaster import broadcaster
                
                async def notify_task_added():
                    await broadcaster.notify_user(
                        user_id,
                        "task_created",
                        {"task_id": task.id, "title": task.title, "completed": task.completed}
                    )
                
                if asyncio.get_event_loop().is_running():
                    asyncio.create_task(notify_task_added())
            except:
                pass  # If broadcaster is not available, continue without error
            
            return {"id": task.id, "title": task.title, "completed": task.completed}
    
    async def update_task(self, user_id: str, task_id: int, title: str = None, description: str = None, completed: bool = None) -> Dict[str, Any]:
        from services.task_service import TaskService
        from database import get_session_context
        from schemas.task_schemas import TaskUpdate
        
        with get_session_context() as db:
            task_service = TaskService()
            update_data = {}
            if title is not None:
                update_data["title"] = title
            if description is not None:
                update_data["description"] = description
            if completed is not None:
                update_data["completed"] = completed
            
            task_update = TaskUpdate(**update_data)
            task = task_service.update_task(user_id, task_id, task_update, db)
            return {"id": task.id, "title": task.title, "completed": task.completed}
    
    async def delete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        from services.task_service import TaskService
        from database import get_session_context
        
        with get_session_context() as db:
            task_service = TaskService()
            task_service.delete_task(user_id, task_id, db)
            return {"message": "Task deleted successfully"}
    
    async def complete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        from services.task_service import TaskService
        from database import get_session_context
        from schemas.task_schemas import TaskToggleComplete
        
        with get_session_context() as db:
            task_service = TaskService()
            task_toggle = TaskToggleComplete(completed=True)
            task = task_service.toggle_task_complete(user_id, task_id, task_toggle, db)
            return {"id": task.id, "title": task.title, "completed": task.completed}


# Create a global task client instance
_task_client_instance = None


def get_task_client():
    global _task_client_instance
    if _task_client_instance is None:
        _task_client_instance = TaskAPIClient()
    return _task_client_instance
