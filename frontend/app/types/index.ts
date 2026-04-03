export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  isCompleted: boolean;
  createdBy: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
}

export interface ApiError {
  message: string;
}

export type TaskStatus = 'all' | 'active' | 'completed' | 'overdue';
export type TaskSort = 'createdAt' | 'dueDate' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  status: TaskStatus;
  sort: TaskSort;
  order: SortOrder;
  search: string;
  page: number;
  limit: number;
}
