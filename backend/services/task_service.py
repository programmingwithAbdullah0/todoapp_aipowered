from typing import List
from sqlmodel import Session, select
from models.task import Task
from schemas.task_schemas import TaskCreate, TaskUpdate, TaskToggleComplete
from utils.errors import TaskNotFoundException, UnauthorizedTaskAccessException


class TaskService:
    @staticmethod
    def get_tasks_for_user(user_id: str, db: Session) -> List[Task]:
        statement = select(Task).where(Task.user_id == user_id)
        return list(db.exec(statement).all())

    @staticmethod
    def create_task(user_id: str, task: TaskCreate, db: Session) -> Task:
        db_task = Task(**task.model_dump(), user_id=user_id)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        # Trigger a notification that a task was created
        # Note: Notifications are handled by the caller if needed
        
        return db_task

    @staticmethod
    def get_task_by_id(user_id: str, task_id: int, db: Session) -> Task:
        task = db.get(Task, task_id)
        if not task:
            raise TaskNotFoundException(task_id)

        if task.user_id != user_id:
            raise UnauthorizedTaskAccessException()

        return task

    @staticmethod
    def get_tasks_by_title(user_id: str, title: str, db: Session) -> List[Task]:
        """
        Find tasks by title (case-insensitive partial match).
        Returns all matching tasks for disambiguation.
        """
        statement = select(Task).where(
            Task.user_id == user_id, Task.title.ilike(f"%{title}%")
        )
        return list(db.exec(statement).all())

    @staticmethod
    def update_task(
        user_id: str, task_id: int, task_update: TaskUpdate, db: Session
    ) -> Task:
        db_task = TaskService.get_task_by_id(user_id, task_id, db)

        # Update task fields
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        return db_task

    @staticmethod
    def delete_task(user_id: str, task_id: int, db: Session) -> None:
        db_task = TaskService.get_task_by_id(user_id, task_id, db)
        db.delete(db_task)
        db.commit()

    @staticmethod
    def toggle_task_complete(
        user_id: str, task_id: int, task_toggle: TaskToggleComplete, db: Session
    ) -> Task:
        db_task = TaskService.get_task_by_id(user_id, task_id, db)
        db_task.completed = task_toggle.completed
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        return db_task
