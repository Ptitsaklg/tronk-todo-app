import type { ApiError } from '~/types';

export function useApiFetch() {
  const config = useRuntimeConfig();
  const authStore = useNuxtApp().$pinia ? useAuthStore() : null;

  return async function apiFetch<T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = authStore?.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      return await $fetch<T>(url, {
        baseURL: config.public.apiBase as string,
        ...options,
        headers,
      });
    } catch (error: unknown) {
      const fetchError = error as { statusCode?: number; data?: ApiError };
      if (fetchError.statusCode === 401 && authStore) {
        authStore.logout();
        navigateTo('/login');
      }
      throw error;
    }
  };
}
