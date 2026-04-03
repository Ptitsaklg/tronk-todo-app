<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <slot />
    <ClientOnly>
      <NotificationToast />
    </ClientOnly>
  </div>
</template>
