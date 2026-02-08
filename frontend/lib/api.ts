import axios, { AxiosError } from 'axios';
import { storage } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      storage.clear();
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

// Task-related API functions
export const taskAPI = {
  // Get all tasks for the authenticated user
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: { title: string; description?: string }) => {
    const response = await apiClient.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (taskId: number, taskData: { title?: string; description?: string; completed?: boolean }) => {
    const response = await apiClient.put<Task>(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    // Backend returns { message: string }
    const response = await apiClient.delete<{ message: string }>(`/tasks/${taskId}`);
    return response.data;
  },

  // Toggle task completion
  toggleTaskComplete: async (taskId: number, completed: boolean) => {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}/complete`, { completed });
    return response.data;
  },
};

// Auth API handled by lib/auth-client.ts via Better Auth, but we handle user fetching manually
export const authAPI = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};