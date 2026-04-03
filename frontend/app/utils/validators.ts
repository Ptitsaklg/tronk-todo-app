export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email обязателен';
  if (!email.includes('@')) return 'Некорректный email';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Пароль обязателен';
  return null;
}

export function validateTaskTitle(title: string): string | null {
  if (!title.trim()) return 'Название обязательно';
  if (title.length > 200) return 'Название не более 200 символов';
  return null;
}

export function validateTaskDescription(description: string): string | null {
  if (description.length > 1000) return 'Описание не более 1000 символов';
  return null;
}

export function validateDueDate(dueDate: string): string | null {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) return 'Некорректная дата';
  const today = new Date(new Date().toDateString());
  if (date < today) return 'Дата не может быть в прошлом';
  return null;
}
