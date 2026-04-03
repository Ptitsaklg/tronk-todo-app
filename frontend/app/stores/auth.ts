import { defineStore } from 'pinia';
import type { User } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    if (import.meta.client) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  function restore() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken && savedUser) {
        token.value = savedToken;
        try {
          user.value = JSON.parse(savedUser) as User;
        } catch {
          logout();
        }
      }
    }
  }

  return { token, user, isAuthenticated, isAdmin, setAuth, logout, restore };
});
