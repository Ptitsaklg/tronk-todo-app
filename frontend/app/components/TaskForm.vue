<script setup lang="ts">
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '~/types';
import { validateTaskTitle, validateTaskDescription, validateDueDate } from '~/utils/validators';

const props = defineProps<{
  task?: Task | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: CreateTaskRequest | UpdateTaskRequest];
}>();

const isEditing = computed(() => !!props.task);

const title = ref(props.task?.title || '');
const description = ref(props.task?.description || '');
const dueDate = ref(props.task?.dueDate ? props.task.dueDate.split('T')[0] : '');

const errors = ref<{ title?: string; description?: string; dueDate?: string }>({});
const loading = ref(false);

function validate(): boolean {
  errors.value = {};
  const titleError = validateTaskTitle(title.value);
  const descError = validateTaskDescription(description.value);
  const dateError = isEditing.value ? null : validateDueDate(dueDate.value);

  if (titleError) errors.value.title = titleError;
  if (descError) errors.value.description = descError;
  if (dateError) errors.value.dueDate = dateError;

  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  if (!validate()) return;

  loading.value = true;
  const data: CreateTaskRequest | UpdateTaskRequest = {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    dueDate: dueDate.value || undefined,
  };
  emit('submit', data);
  loading.value = false;
}
</script>

<template>
  <BaseModal :title="isEditing ? 'Редактировать задачу' : 'Создать задачу'" @close="$emit('close')">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <BaseInput
        v-model="title"
        label="Название"
        placeholder="Введите название задачи"
        :error="errors.title"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          v-model="description"
          rows="3"
          placeholder="Описание задачи (необязательно)"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          :class="errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'"
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
        <input
          v-model="dueDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          :class="errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'"
        />
        <p v-if="errors.dueDate" class="mt-1 text-sm text-red-600">{{ errors.dueDate }}</p>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('close')">Отмена</BaseButton>
        <BaseButton type="submit" :loading="loading">Сохранить</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
