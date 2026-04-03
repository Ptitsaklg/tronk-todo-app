<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  loading?: boolean;
  disabled?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    :class="[
      size === 'sm' ? 'px-3 py-1.5 text-sm gap-1.5' : 'px-4 py-2.5 text-sm gap-2',
      {
        'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        'text-gray-500 hover:text-gray-700 hover:bg-gray-100': variant === 'ghost',
      },
    ]"
  >
    <BaseSpinner v-if="loading" size="sm" />
    <slot />
  </button>
</template>
