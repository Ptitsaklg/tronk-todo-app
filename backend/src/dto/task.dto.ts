export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
}

export function validateCreateTaskDto(body: Record<string, unknown>): string | null {
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    return 'Title is required';
  }
  if (typeof body.title === 'string' && body.title.length > 200) {
    return 'Title must be at most 200 characters';
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    return 'Description must be a string';
  }
  if (typeof body.description === 'string' && body.description.length > 1000) {
    return 'Description must be at most 1000 characters';
  }
  if (body.dueDate !== undefined) {
    if (typeof body.dueDate !== 'string') {
      return 'Due date must be a string';
    }
    const date = new Date(body.dueDate);
    if (isNaN(date.getTime())) {
      return 'Due date must be a valid date';
    }
    if (date < new Date(new Date().toDateString())) {
      return 'Due date cannot be in the past';
    }
  }
  return null;
}

export function validateUpdateTaskDto(body: Record<string, unknown>): string | null {
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      return 'Title must be a non-empty string';
    }
    if (body.title.length > 200) {
      return 'Title must be at most 200 characters';
    }
  }
  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    return 'Description must be a string';
  }
  if (typeof body.description === 'string' && body.description.length > 1000) {
    return 'Description must be at most 1000 characters';
  }
  if (body.dueDate !== undefined && body.dueDate !== null) {
    if (typeof body.dueDate !== 'string') {
      return 'Due date must be a string';
    }
    const date = new Date(body.dueDate);
    if (isNaN(date.getTime())) {
      return 'Due date must be a valid date';
    }
  }
  if (body.isCompleted !== undefined && typeof body.isCompleted !== 'boolean') {
    return 'isCompleted must be a boolean';
  }
  return null;
}
