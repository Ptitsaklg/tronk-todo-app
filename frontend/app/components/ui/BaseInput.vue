<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string | null;
  type?: string;
  placeholder?: string;
  modelValue?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      :class="error ? 'border-red-300 bg-red-50' : 'border-gray-300'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
