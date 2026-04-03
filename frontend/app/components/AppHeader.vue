<script setup lang="ts">
const authStore = useAuthStore();
const { logout } = useAuth();
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <h1 class="text-lg font-bold text-gray-900">Todo App</h1>

      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600 hidden sm:inline">{{ authStore.user?.email }}</span>
        <span
          class="text-xs font-medium px-2 py-0.5 rounded-full"
          :class="authStore.isAdmin
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600'"
        >
          {{ authStore.user?.role }}
        </span>
        <BaseButton variant="ghost" size="sm" @click="logout">
          Выйти
        </BaseButton>
      </div>
    </div>
  </header>
</template>
