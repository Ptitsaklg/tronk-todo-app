<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  'update:currentPage': [page: number];
}>();

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4);
    else start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 mt-6">
    <button
      :disabled="currentPage <= 1"
      class="px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      &larr; Назад
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      class="px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 cursor-pointer"
      :class="page === currentPage
        ? 'bg-indigo-600 text-white'
        : 'hover:bg-gray-100 text-gray-700'"
      @click="emit('update:currentPage', page)"
    >
      {{ page }}
    </button>

    <button
      :disabled="currentPage >= totalPages"
      class="px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      Вперёд &rarr;
    </button>
  </div>
</template>
