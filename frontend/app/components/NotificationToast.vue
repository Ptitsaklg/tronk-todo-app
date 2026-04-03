<script setup lang="ts">
const { notifications } = useNotification();
</script>

<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-for="n in notifications"
        :key="n.id"
        class="px-4 py-3 rounded-lg shadow-lg text-sm text-white min-w-[250px]"
        :class="n.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
      >
        {{ n.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
