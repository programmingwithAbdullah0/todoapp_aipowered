import httpx
import os
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class TaskToggleComplete(BaseModel):
    completed: bool


class TaskTools:
    def __init__(self):
        self.base_url = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")
        self.api_token = None  # Will be set when processing a user request

    def set_user_token(self, token: str):
        """Set the user token for API calls"""
        self.api_token = token

    async def add_task(self, title: str, description: str = "") -> dict:
        """Add a new task via API call"""
        headers = {}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/tasks",
                    json={"title": title, "description": description},
                    headers=headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"error": f"Failed to add task: {str(e)}, status: {e.response.status_code}"}
            except Exception as e:
                return {"error": f"Failed to add task: {str(e)}"}

    async def list_tasks(self) -> list:
        """List all tasks via API call"""
        headers = {}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/tasks",
                    headers=headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return [{"error": f"Failed to list tasks: {str(e)}, status: {e.response.status_code}"}]
            except Exception as e:
                return [{"error": f"Failed to list tasks: {str(e)}"}]

    async def update_task(self, task_id: int, title: str = None, description: str = None) -> dict:
        """Update a task via API call"""
        headers = {}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if description is not None:
            update_data["description"] = description
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.put(
                    f"{self.base_url}/api/tasks/{task_id}",
                    json=update_data,
                    headers=headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"error": f"Failed to update task: {str(e)}, status: {e.response.status_code}"}
            except Exception as e:
                return {"error": f"Failed to update task: {str(e)}"}

    async def delete_task(self, task_id: int) -> dict:
        """Delete a task via API call"""
        headers = {}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(
                    f"{self.base_url}/api/tasks/{task_id}",
                    headers=headers
                )
                response.raise_for_status()
                return {"message": "Task deleted successfully"}
            except httpx.HTTPStatusError as e:
                return {"error": f"Failed to delete task: {str(e)}, status: {e.response.status_code}"}
            except Exception as e:
                return {"error": f"Failed to delete task: {str(e)}"}

    async def complete_task(self, task_id: int, completed: bool = True) -> dict:
        """Toggle task completion status via API call"""
        headers = {}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.patch(
                    f"{self.base_url}/api/tasks/{task_id}/complete",
                    json={"completed": completed},
                    headers=headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"error": f"Failed to toggle task completion: {str(e)}, status: {e.response.status_code}"}
            except Exception as e:
                return {"error": f"Failed to toggle task completion: {str(e)}"}