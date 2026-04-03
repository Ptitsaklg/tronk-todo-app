<script setup lang="ts">
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '~/types';

definePageMeta({
  middleware: 'auth',
});

const store = useTasksStore();
const authStore = useAuthStore();
const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } = useTasks();

const showForm = ref(false);
const editingTask = ref<Task | null>(null);
const deletingTask = ref<Task | null>(null);
const deleteLoading = ref(false);

const hasFilters = computed(() =>
  store.filters.status !== 'all' || store.filters.search !== '',
);

watch(
  () => store.filters,
  () => fetchTasks(),
  { deep: true },
);

onMounted(() => {
  fetchTasks();
});

function openCreate() {
  editingTask.value = null;
  showForm.value = true;
}

function openEdit(task: Task) {
  editingTask.value = task;
  showForm.value = true;
}

async function onFormSubmit(data: CreateTaskRequest | UpdateTaskRequest) {
  let ok: boolean;
  if (editingTask.value) {
    ok = await updateTask(editingTask.value.id, data as UpdateTaskRequest);
  } else {
    ok = await createTask(data as CreateTaskRequest);
  }
  if (ok) {
    showForm.value = false;
    editingTask.value = null;
  }
}

function openDelete(task: Task) {
  deletingTask.value = task;
}

async function onConfirmDelete() {
  if (!deletingTask.value) return;
  deleteLoading.value = true;
  await deleteTask(deletingTask.value.id);
  deleteLoading.value = false;
  deletingTask.value = null;
}

function onPageChange(page: number) {
  store.updateFilter('page', page);
}
</script>

<template>
  <div>
    <TaskFilters @create="openCreate" />

    <div v-if="store.error" class="bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-sm">
      {{ store.error }}
      <button class="underline ml-2 cursor-pointer" @click="fetchTasks">Повторить</button>
    </div>

    <TaskEmpty
      v-if="!store.loading && store.tasks.length === 0"
      :has-filters="hasFilters"
      @create="openCreate"
    />

    <TaskList
      v-else
      :tasks="store.tasks"
      :loading="store.loading"
      :show-author="authStore.isAdmin"
      @edit="openEdit"
      @delete="openDelete"
      @toggle="toggleComplete"
    />

    <BasePagination
      v-if="store.totalPages > 1"
      :current-page="store.filters.page"
      :total-pages="store.totalPages"
      @update:current-page="onPageChange"
    />

    <ClientOnly>
      <TaskForm
        v-if="showForm"
        :task="editingTask"
        @close="showForm = false"
        @submit="onFormSubmit"
      />

      <ConfirmDialog
        v-if="deletingTask"
        :loading="deleteLoading"
        @confirm="onConfirmDelete"
        @cancel="deletingTask = null"
      />
    </ClientOnly>
  </div>
</template>
