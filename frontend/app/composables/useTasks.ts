import type {
  TasksResponse,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiError,
} from '~/types';

export function useTasks() {
  const store = useTasksStore();
  const { success, error: notifyError } = useNotification();

  async function fetchTasks() {
    store.loading = true;
    store.error = null;
    try {
      const apiFetch = useApiFetch();
      const params = new URLSearchParams();
      const f = store.filters;
      params.set('status', f.status);
      params.set('sort', f.sort);
      params.set('order', f.order);
      params.set('page', String(f.page));
      params.set('limit', String(f.limit));
      if (f.search) params.set('search', f.search);

      const data = await apiFetch<TasksResponse>(`/api/tasks?${params.toString()}`);
      store.setTasks(data.tasks, data.total);
    } catch (err: unknown) {
      const fetchError = err as { data?: ApiError };
      store.error = fetchError.data?.message || 'Ошибка загрузки задач';
      notifyError(store.error);
    } finally {
      store.loading = false;
    }
  }

  async function createTask(data: CreateTaskRequest): Promise<boolean> {
    try {
      const apiFetch = useApiFetch();
      await apiFetch<Task>('/api/tasks', {
        method: 'POST',
        body: data,
      });
      success('Задача создана');
      await fetchTasks();
      return true;
    } catch (err: unknown) {
      const fetchError = err as { data?: ApiError };
      notifyError(fetchError.data?.message || 'Ошибка создания задачи');
      return false;
    }
  }

  async function updateTask(id: string, data: UpdateTaskRequest): Promise<boolean> {
    try {
      const apiFetch = useApiFetch();
      await apiFetch<Task>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: data,
      });
      success('Задача обновлена');
      await fetchTasks();
      return true;
    } catch (err: unknown) {
      const fetchError = err as { data?: ApiError };
      notifyError(fetchError.data?.message || 'Ошибка обновления задачи');
      return false;
    }
  }

  async function deleteTask(id: string): Promise<boolean> {
    try {
      const apiFetch = useApiFetch();
      await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      success('Задача удалена');
      await fetchTasks();
      return true;
    } catch (err: unknown) {
      const fetchError = err as { data?: ApiError };
      notifyError(fetchError.data?.message || 'Ошибка удаления задачи');
      return false;
    }
  }

  async function toggleComplete(task: Task) {
    await updateTask(task.id, { isCompleted: !task.isCompleted });
  }

  return { fetchTasks, createTask, updateTask, deleteTask, toggleComplete };
}
