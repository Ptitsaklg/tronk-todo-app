<script setup lang="ts">
defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close');
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click="onOverlayClick"
    >
      <div class="bg-white max-w-lg w-full rounded-xl shadow-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
