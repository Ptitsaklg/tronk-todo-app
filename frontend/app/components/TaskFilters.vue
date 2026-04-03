<script setup lang="ts">
import type { TaskStatus, TaskSort, SortOrder } from '~/types';

defineEmits<{
  create: [];
}>();

const store = useTasksStore();

const statusTabs: { label: string; value: TaskStatus }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Завершённые', value: 'completed' },
  { label: 'Просроченные', value: 'overdue' },
];

const sortOptions: { label: string; value: TaskSort }[] = [
  { label: 'По дате создания', value: 'createdAt' },
  { label: 'По дедлайну', value: 'dueDate' },
  { label: 'По статусу', value: 'status' },
];

let searchTimeout: ReturnType<typeof setTimeout>;

function onSearch(value: string) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.updateFilter('search', value);
  }, 300);
}

function onSortChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  store.updateFilter('sort', value as TaskSort);
}

function toggleOrder() {
  const newOrder: SortOrder = store.filters.order === 'desc' ? 'asc' : 'desc';
  store.updateFilter('order', newOrder);
}
</script>

<template>
  <div class="space-y-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-3">
      <BaseButton @click="$emit('create')">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Создать задачу
      </BaseButton>

      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Поиск задач..."
          :value="store.filters.search"
          class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          @input="onSearch(($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex gap-2">
        <select
          :value="store.filters.sort"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          @change="onSortChange"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <button
          class="px-2 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          :title="store.filters.order === 'desc' ? 'По убыванию' : 'По возрастанию'"
          @click="toggleOrder"
        >
          <svg class="w-4 h-4 transition-transform" :class="store.filters.order === 'asc' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex gap-1 flex-wrap">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        class="px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 cursor-pointer"
        :class="store.filters.status === tab.value
          ? 'bg-indigo-100 text-indigo-700 font-medium'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        @click="store.updateFilter('status', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
