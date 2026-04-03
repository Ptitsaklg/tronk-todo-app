interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const notifications = ref<Notification[]>([]);
let nextId = 0;

export function useNotification() {
  function notify(message: string, type: 'success' | 'error' = 'success') {
    const id = nextId++;
    notifications.value.push({ id, message, type });
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }, 3000);
  }

  function success(message: string) {
    notify(message, 'success');
  }

  function error(message: string) {
    notify(message, 'error');
  }

  return { notifications, notify, success, error };
}
