<script setup lang="ts">
defineProps<{
  message?: string;
  loading?: boolean;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <BaseModal title="Подтверждение" @close="$emit('cancel')">
    <div class="flex flex-col items-center text-center py-4">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-sm text-gray-600">{{ message || 'Вы уверены, что хотите удалить эту задачу?' }}</p>
    </div>
    <div class="flex justify-end gap-3 mt-2">
      <BaseButton variant="secondary" @click="$emit('cancel')">Отмена</BaseButton>
      <BaseButton variant="danger" :loading="loading" @click="$emit('confirm')">Удалить</BaseButton>
    </div>
  </BaseModal>
</template>
