<script setup lang="ts">
const authStore = useAuthStore();
authStore.restore();

if (authStore.isAuthenticated) {
  navigateTo('/tasks');
} else {
  navigateTo('/login');
}
</script>

<template>
  <div />
</template>
