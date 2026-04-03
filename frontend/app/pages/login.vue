<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const { login, loading, error } = useAuth();

const email = ref('');
const password = ref('');
const formErrors = ref<{ email?: string; password?: string }>({});

function onSubmit() {
  formErrors.value = {};

  const emailErr = validateEmail(email.value);
  const passErr = validatePassword(password.value);

  if (emailErr) formErrors.value.email = emailErr;
  if (passErr) formErrors.value.password = passErr;

  if (Object.keys(formErrors.value).length > 0) return;

  login({ email: email.value, password: password.value });
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Вход в систему</h2>

      <div
        v-if="error"
        class="bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-sm"
      >
        {{ error }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="Введите email"
          :error="formErrors.email"
        />

        <BaseInput
          v-model="password"
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          :error="formErrors.password"
        />

        <BaseButton type="submit" class="w-full" :loading="loading">
          Войти
        </BaseButton>
      </form>

      <p class="text-xs text-gray-400 text-center mt-4">
        admin@test.com / admin123 &bull; user@test.com / user123
      </p>
    </div>
  </div>
</template>
