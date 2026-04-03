<script setup lang="ts">
defineProps<{
  hasFilters?: boolean;
}>();

defineEmits<{
  create: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg v-if="hasFilters" class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <svg v-else class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p class="text-lg font-medium mb-1">
      {{ hasFilters ? 'Задачи не найдены' : 'Нет задач' }}
    </p>
    <p class="text-sm mb-4">
      {{ hasFilters ? 'Попробуйте изменить параметры поиска' : 'Создайте первую задачу' }}
    </p>
    <BaseButton v-if="!hasFilters" @click="$emit('create')">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Создать задачу
    </BaseButton>
  </div>
</template>
