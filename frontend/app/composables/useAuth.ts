import type { LoginRequest, LoginResponse, ApiError } from '~/types';

export function useAuth() {
  const authStore = useAuthStore();
  const { success, error: notifyError } = useNotification();
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(credentials: LoginRequest) {
    loading.value = true;
    error.value = null;
    try {
      const apiFetch = useApiFetch();
      const data = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      authStore.setAuth(data.token, data.user);
      success('Вход выполнен');
      navigateTo('/tasks');
    } catch (err: unknown) {
      const fetchError = err as { data?: ApiError };
      error.value = fetchError.data?.message || 'Ошибка входа';
      notifyError(error.value);
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    authStore.logout();
    navigateTo('/login');
  }

  return { login, logout, loading, error };
}
