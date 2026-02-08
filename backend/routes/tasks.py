from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List
from database import get_session
from schemas.task_schemas import TaskRead, TaskCreate, TaskUpdate, TaskToggleComplete
from dependencies.auth import get_current_user
from services.task_service import TaskService

router = APIRouter()


@router.get("/tasks", response_model=List[TaskRead])
async def get_tasks(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get all tasks for the current user."""
    return TaskService.get_tasks_for_user(current_user, db)


@router.post("/tasks", response_model=TaskRead)
async def create_task(
    task: TaskCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Create a new task for the current user."""
    return TaskService.create_task(current_user, task, db)


@router.get("/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get a specific task by ID."""
    return TaskService.get_task_by_id(current_user, task_id, db)


@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Update a specific task by ID."""
    return TaskService.update_task(current_user, task_id, task_update, db)


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Delete a specific task by ID."""
    TaskService.delete_task(current_user, task_id, db)
    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
async def toggle_task_complete(
    task_id: int,
    task_toggle: TaskToggleComplete,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Toggle the completion status of a task."""
    return TaskService.toggle_task_complete(current_user, task_id, task_toggle, db)
