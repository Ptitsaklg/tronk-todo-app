export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  authStore.restore();
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
