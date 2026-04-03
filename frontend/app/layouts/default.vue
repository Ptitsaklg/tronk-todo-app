<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-5xl mx-auto px-4 py-6 sm:px-6">
      <slot />
    </main>
    <ClientOnly>
      <NotificationToast />
    </ClientOnly>
  </div>
</template>
