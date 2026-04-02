# Design Reference

## Общий стиль
- Чистый, современный минималистичный интерфейс
- Primary color: indigo (indigo-600, indigo-700 для hover)
- Background: gray-50 для body, white для карточек
- Карточки: bg-white shadow-sm rounded-lg border border-gray-200
- Шрифт: системный стек (font-sans)
- Переходы: transition-colors duration-200

## Страница Login (/login)
- Layout: auth (без хедера, полноэкранный центрированный)
- Фон: gradient от indigo-50 к white или просто gray-50
- Карточка формы: max-w-md mx-auto, bg-white shadow-lg rounded-xl p-8
- Заголовок: "Вход в систему", text-2xl font-bold
- Поля: email (type=email), password (type=password)
- Кнопка: "Войти", w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5
- Ошибка: красный бейдж под формой, bg-red-50 text-red-700 rounded-lg p-3
- Спиннер в кнопке при отправке

## Страница Tasks (/tasks)
- Layout: default (с хедером)

### Header (AppHeader)
- bg-white shadow-sm border-b
- Внутри: название приложения (слева), email пользователя + роль badge + кнопка "Выйти" (справа)
- max-w-5xl mx-auto

### Панель инструментов (TaskFilters)
- Flex-обёртка, gap-4, flex-wrap
- Кнопка "Создать задачу": bg-indigo-600, иконка +
- Поле поиска: с иконкой лупы, placeholder "Поиск задач..."
- Табы фильтров: Все / Активные / Завершённые / Просроченные
  - Активный таб: bg-indigo-100 text-indigo-700
  - Неактивный: text-gray-500 hover:text-gray-700
- Dropdown сортировки: по дате создания / по дедлайну / по статусу

### Список задач (TaskList → TaskCard)
- Каждая задача — карточка:
  - Слева: checkbox (круглый, indigo при checked)
  - Центр: title (font-medium, line-through + text-gray-400 если выполнена)
  - Под title: description (text-sm text-gray-500, truncate 2 строки)
  - Справа: дедлайн (text-sm, красный если просрочен, зелёный если сегодня)
  - Справа: кнопки edit (карандаш) и delete (корзина), иконки
  - Badge с именем автора (для admin-а)
- Hover на карточке: shadow-md, лёгкий подъём

### Пустые состояния (TaskEmpty)
- Иконка (clipboard или check-circle), text-gray-400, крупная
- Текст: "Нет задач" / "Задачи не найдены" / "Все задачи выполнены"
- Кнопка "Создать первую задачу" если список пуст

### Пагинация (BasePagination)
- Внизу списка, по центру
- Кнопки: ← Prev, номера страниц, Next →
- Текущая страница: bg-indigo-600 text-white

## Модальное окно (TaskForm)
- Overlay: bg-black/50 fixed inset-0 z-50
- Модалка: bg-white max-w-lg mx-auto rounded-xl shadow-xl p-6
- Заголовок: "Создать задачу" / "Редактировать задачу"
- Поля:
  - Название (text input, обязательно, красная рамка при ошибке)
  - Описание (textarea, 3 строки)
  - Дедлайн (date input)
- Кнопки: "Сохранить" (indigo) + "Отмена" (серая)
- Закрытие по клику на overlay и по Escape

## Диалог подтверждения (ConfirmDialog)
- Маленькая модалка по центру
- Иконка предупреждения (красная)
- Текст: "Вы уверены, что хотите удалить эту задачу?"
- Кнопки: "Удалить" (красная) + "Отмена"

## Уведомления
- Toast в правом верхнем углу
- Зелёный для успеха, красный для ошибки
- Авто-скрытие через 3 секунды
- Transition slide-in

## Адаптивность
- Mobile (<640px): карточки на всю ширину, фильтры в столбик, компактный хедер
- Tablet (640-1024px): 2 колонки фильтров
- Desktop (>1024px): max-w-5xl mx-auto, всё в одну строку