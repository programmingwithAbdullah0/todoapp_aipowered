import { useState, useEffect, useCallback } from "react";
import { taskAPI, Task } from "../lib/api";
import { useAuth } from "../lib/auth";

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await taskAPI.getTasks();
            setTasks(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to fetch tasks");
            }

        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        const handleTasksUpdated = () => {
            fetchTasks();
        };

        window.addEventListener("tasks-updated", handleTasksUpdated);
        return () => {
            window.removeEventListener("tasks-updated", handleTasksUpdated);
        };
    }, [fetchTasks]);

    const createTask = async (taskData: { title: string; description?: string }) => {
        try {
            setError(null);
            const newTask = await taskAPI.createTask(taskData);
            setTasks((prev) => [newTask, ...prev]);
            return newTask;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to create task");
            }

        }
    };

    const updateTask = async (id: number, updates: Partial<Task>) => {
        try {
            setError(null);
            const updated = await taskAPI.updateTask(id, updates);
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
            return updated;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update task");
            }

        }
    };

    const deleteTask = async (id: number) => {
        try {
            setError(null);
            await taskAPI.deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to delete task");
            }

        }
    };

    const toggleComplete = async (id: number, completed: boolean) => {
        try {
            // Optimistic update
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));

            const updated = await taskAPI.toggleTaskComplete(id, completed);
            // Reconcile with server response
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (err: unknown) {
            // Revert optimistic update
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to toggle task");
            }

        }
    };

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        refreshTasks: fetchTasks
    };
}
