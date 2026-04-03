import { defineStore } from 'pinia';
import type { Task, TaskFilters } from '~/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const filters = ref<TaskFilters>({
    status: 'all',
    sort: 'createdAt',
    order: 'desc',
    search: '',
    page: 1,
    limit: 10,
  });

  const totalPages = computed(() => Math.ceil(total.value / filters.value.limit));

  function setTasks(newTasks: Task[], newTotal: number) {
    tasks.value = newTasks;
    total.value = newTotal;
  }

  function updateFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    filters.value[key] = value;
    if (key !== 'page') {
      filters.value.page = 1;
    }
  }

  function resetFilters() {
    filters.value = {
      status: 'all',
      sort: 'createdAt',
      order: 'desc',
      search: '',
      page: 1,
      limit: 10,
    };
  }

  return { tasks, total, loading, error, filters, totalPages, setTasks, updateFilter, resetFilters };
});
