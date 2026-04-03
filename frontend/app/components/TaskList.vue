<script setup lang="ts">
import type { Task } from '~/types';

defineProps<{
  tasks: Task[];
  loading: boolean;
  showAuthor?: boolean;
}>();

defineEmits<{
  edit: [task: Task];
  delete: [task: Task];
  toggle: [task: Task];
}>();
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <BaseSpinner size="lg" class="text-indigo-600" />
    </div>

    <div v-else class="space-y-3">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :show-author="showAuthor"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>
