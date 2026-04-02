import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { tasks } from '../data/store';
import { users } from '../data/store';
import { AuthenticatedRequest, AppError, Task } from '../types';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

export function getTasks(req: AuthenticatedRequest, res: Response): void {
  const user = req.user!;
  const {
    sort = 'createdAt',
    order = 'desc',
    status = 'all',
    search = '',
    page = '1',
    limit = '10',
  } = req.query as Record<string, string>;

  // Filter by role: user sees only own tasks, admin sees all
  let filtered = user.role === 'admin'
    ? [...tasks]
    : tasks.filter((t) => t.createdBy === user.id);

  // Filter by status
  const now = new Date();
  if (status === 'active') {
    filtered = filtered.filter((t) => !t.isCompleted);
  } else if (status === 'completed') {
    filtered = filtered.filter((t) => t.isCompleted);
  } else if (status === 'overdue') {
    filtered = filtered.filter((t) => !t.isCompleted && t.dueDate && new Date(t.dueDate) < now);
  }

  // Search by title and description
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }

  // Sort
  const sortField = ['createdAt', 'dueDate', 'status'].includes(sort) ? sort : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  filtered.sort((a, b) => {
    if (sortField === 'status') {
      return (Number(a.isCompleted) - Number(b.isCompleted)) * sortOrder;
    }
    if (sortField === 'dueDate') {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return (aDate - bDate) * sortOrder;
    }
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortOrder;
  });

  // Paginate
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const total = filtered.length;
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({ tasks: paginated, total, page: pageNum, limit: limitNum });
}

export function createTask(req: AuthenticatedRequest, res: Response): void {
  const user = req.user!;
  const { title, description, dueDate } = req.body as CreateTaskDto;

  const userRecord = users.find((u) => u.id === user.id);

  const task: Task = {
    id: `tsk_${uuidv4().slice(0, 8)}`,
    title: title.trim(),
    description: description?.trim() || '',
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    isCompleted: false,
    createdBy: user.id,
    createdByEmail: userRecord?.email || user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
}

export function updateTask(req: AuthenticatedRequest, res: Response): void {
  const user = req.user!;
  const { id } = req.params;
  const updates = req.body as UpdateTaskDto;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new AppError(404, 'Task not found');
  }

  const task = tasks[taskIndex];

  // Access control: user can only edit own tasks
  if (user.role !== 'admin' && task.createdBy !== user.id) {
    throw new AppError(403, 'Access denied');
  }

  if (updates.title !== undefined) task.title = updates.title.trim();
  if (updates.description !== undefined) task.description = updates.description?.trim() || '';
  if (updates.dueDate !== undefined) task.dueDate = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;
  if (updates.isCompleted !== undefined) task.isCompleted = updates.isCompleted;
  task.updatedAt = new Date().toISOString();

  res.json(task);
}

export function deleteTask(req: AuthenticatedRequest, res: Response): void {
  const user = req.user!;
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new AppError(404, 'Task not found');
  }

  const task = tasks[taskIndex];

  if (user.role !== 'admin' && task.createdBy !== user.id) {
    throw new AppError(403, 'Access denied');
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
}
