<script setup lang="ts">
import type { Task } from '~/types';

const props = defineProps<{
  task: Task;
  showAuthor?: boolean;
}>();

const emit = defineEmits<{
  edit: [task: Task];
  delete: [task: Task];
  toggle: [task: Task];
}>();

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.isCompleted) return false;
  return new Date(props.task.dueDate) < new Date();
});

const isToday = computed(() => {
  if (!props.task.dueDate) return false;
  const due = new Date(props.task.dueDate).toDateString();
  return due === new Date().toDateString();
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 flex items-start gap-3"
  >
    <!-- Checkbox -->
    <button
      class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer"
      :class="task.isCompleted
        ? 'bg-indigo-600 border-indigo-600'
        : 'border-gray-300 hover:border-indigo-400'"
      @click="emit('toggle', task)"
    >
      <svg v-if="task.isCompleted" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <h3
          class="font-medium text-sm"
          :class="task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'"
        >
          {{ task.title }}
        </h3>
      </div>

      <p
        v-if="task.description"
        class="text-sm text-gray-500 mt-0.5 line-clamp-2"
      >
        {{ task.description }}
      </p>

      <div class="flex items-center gap-2 mt-2 flex-wrap">
        <span
          v-if="task.dueDate"
          class="text-xs px-2 py-0.5 rounded-full"
          :class="{
            'bg-red-100 text-red-700': isOverdue,
            'bg-green-100 text-green-700': isToday && !isOverdue,
            'bg-gray-100 text-gray-600': !isOverdue && !isToday,
          }"
        >
          {{ formatDate(task.dueDate) }}
        </span>

        <span
          v-if="showAuthor"
          class="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
        >
          {{ task.createdByEmail }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 flex-shrink-0">
      <button
        class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
        title="Редактировать"
        @click="emit('edit', task)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
        title="Удалить"
        @click="emit('delete', task)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
