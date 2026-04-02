# To-Do List Application
 
## Обзор
Тестовое задание — полнофункциональное приложение для управления задачами.
Монорепо: frontend (Nuxt 4) + backend (Node.js + Express) в одном репозитории.
Два отдельных процесса, связанных через REST API.
 
## Стек
 
### Frontend (`frontend/`)
- Nuxt 4 (Vue 3, Composition API, `<script setup lang="ts">`)
- Pinia для state management
- Tailwind CSS 4
- TypeScript (строгий режим)
- Порт: 3000
 
### Backend (`backend/`)
- Node.js + Express
- JWT авторизация (jsonwebtoken)
- TypeScript (ts-node-dev для dev-режима)
- CORS (пакет cors)
- In-memory хранилище данных
- Порт: 3001
 
### Корень
- concurrently для параллельного запуска frontend и backend
- Единый `npm run dev` из корня
 
---
 
## Структура frontend
 
```
frontend/
├── app/                         ← Nuxt 4 srcDir
│   ├── pages/
│   │   ├── index.vue            ← редирект на /tasks или /login
│   │   ├── login.vue            ← страница авторизации
│   │   └── tasks.vue            ← основная страница с задачами
│   ├── components/
│   │   ├── TaskList.vue         ← список задач
│   │   ├── TaskCard.vue         ← карточка одной задачи
│   │   ├── TaskForm.vue         ← модалка создания/редактирования
│   │   ├── TaskFilters.vue      ← фильтры + поиск + сортировка
│   │   ├── TaskEmpty.vue        ← пустое состояние
│   │   ├── AppHeader.vue        ← шапка с логаутом
│   │   ├── ConfirmDialog.vue    ← подтверждение удаления
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       ├── BaseModal.vue
│   │       ├── BaseSpinner.vue
│   │       └── BasePagination.vue
│   ├── composables/
│   │   ├── useAuth.ts           ← логика авторизации
│   │   ├── useTasks.ts          ← CRUD операции с задачами
│   │   └── useNotification.ts   ← toast-уведомления
│   ├── stores/
│   │   ├── auth.ts              ← Pinia: токен, пользователь, isAuthenticated
│   │   └── tasks.ts             ← Pinia: список задач, фильтры, пагинация
│   ├── middleware/
│   │   └── auth.ts              ← route guard: нет токена → /login
│   ├── layouts/
│   │   ├── default.vue          ← layout с хедером (для /tasks)
│   │   └── auth.vue             ← layout без хедера (для /login)
│   ├── types/
│   │   └── index.ts             ← Task, User, LoginRequest, ApiError, etc.
│   └── utils/
│       ├── api.ts               ← обёртка $fetch с baseURL и interceptor 401
│       └── validators.ts        ← валидация полей форм
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
 
## Структура backend
 
```
backend/
├── src/
│   ├── index.ts                 ← app.listen(3001)
│   ├── app.ts                   ← express(), cors(), json(), роуты, errorHandler
│   ├── routes/
│   │   ├── auth.ts              ← POST /api/auth/login
│   │   └── tasks.ts             ← GET/POST /api/tasks, PUT/DELETE /api/tasks/:id
│   ├── controllers/
│   │   ├── auth.controller.ts   ← логика login
│   │   └── tasks.controller.ts  ← логика CRUD задач
│   ├── middleware/
│   │   ├── auth.ts              ← проверка JWT из Authorization header
│   │   ├── validate.ts          ← валидация request body по DTO
│   │   └── errorHandler.ts      ← глобальный обработчик ошибок
│   ├── dto/
│   │   ├── auth.dto.ts          ← LoginDto: { email, password }
│   │   └── task.dto.ts          ← CreateTaskDto, UpdateTaskDto
│   ├── types/
│   │   └── index.ts             ← Task, User, JwtPayload, etc.
│   └── data/
│       └── store.ts             ← массивы users[] и tasks[] + seed data
├── tsconfig.json
└── package.json
```
 
---
 
## Правила кода
 
### Общие
- Весь код на TypeScript, без `any`
- Именование: PascalCase для компонентов, camelCase для функций/переменных
- Комментарии только к нетривиальной логике, на английском
 
### Frontend (Nuxt 4)
- Composition API с `<script setup lang="ts">` во всех компонентах
- `app/` как srcDir (Nuxt 4 convention)
- Для запросов к API использовать обёртку из `utils/api.ts`:
  - baseURL = `http://localhost:3001` (из runtimeConfig)
  - Автоматически добавляет Authorization header из Pinia auth store
  - При 401 — очищает токен, вызывает navigateTo('/login')
- В `<script setup>` для загрузки данных при SSR — `useAsyncData` + обёртку api
- В event handlers (клик, submit) — прямые вызовы api
- `navigateTo()` вместо `router.push()`
- `useState` для SSR-safe shared state
- Проверять `import.meta.client` перед доступом к `window`/`localStorage`
- `<ClientOnly>` для компонентов, зависящих от browser API
 
### Backend (Express)
- Контроллеры отдельно от роутов
- DTO для каждого request body (CreateTaskDto, UpdateTaskDto, LoginDto)
- Middleware auth.ts:
  - Берёт token из `Authorization: Bearer <token>`
  - Верифицирует через jsonwebtoken
  - Кладёт decoded payload в `req.user`
  - При невалидном/отсутствующем токене — 401
- CORS: разрешить origin `http://localhost:3000`
- Все ошибки через глобальный errorHandler middleware
- HTTP статус-коды: 200, 201, 204, 400, 401, 403, 404, 500
- UUID для id задач (пакет uuid)
 
### Стилизация
- Tailwind utility classes, никакого scoped CSS
- Адаптивная вёрстка (mobile-first)
- Цветовая схема: indigo как primary color
- Карточки задач: bg-white, shadow-sm, rounded-lg
 
---
 
## Связь frontend ↔ backend
 
### nuxt.config.ts — runtimeConfig
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001'
    }
  }
})
```
 
### frontend/app/utils/api.ts — обёртка для запросов
Создать функцию `useApi()` или хелпер `apiFetch()`:
- Использует `$fetch` с `baseURL` из runtimeConfig
- Добавляет `Authorization: Bearer <token>` из auth store
- Перехватывает ответы с 401:
  - Очищает auth store (токен, user)
  - `navigateTo('/login')`
- Возвращает типизированный ответ
 
### backend/src/app.ts — CORS
```ts
import cors from 'cors'
 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```
 
### Прокси (опционально, для SSR)
В `nuxt.config.ts` можно добавить Nitro proxy для dev-режима, чтобы
SSR-запросы тоже шли на backend:
```ts
nitro: {
  devProxy: {
    '/api': {
      target: 'http://localhost:3001/api',
      changeOrigin: true
    }
  }
}
```
Это позволяет фронтенду использовать относительные пути `/api/*`
вместо абсолютных URL, и упрощает SSR.
 
---
 
## Тестовые данные (backend/src/data/store.ts)
 
Два пользователя:
- admin@test.com / admin123 (role: 'admin')
- user@test.com / user123 (role: 'user')
 
JWT_SECRET: из .env файла
 
5-10 задач с разными статусами, дедлайнами (часть просроченных),
распределённых между обоими пользователями.
 
---
 
## Функционал
 
### Обязательный (MVP)
1. **Авторизация**: форма email/password → POST /api/auth/login → JWT в localStorage
2. **Перехват 401**: автоматическая очистка токена → редирект /login
3. **Список задач**: GET /api/tasks с сортировкой по дате и статусу
4. **Создание задачи**: модалка с полями title, description, dueDate → POST /api/tasks
5. **Редактирование**: модалка с предзаполненными данными → PUT /api/tasks/:id
6. **Удаление**: диалог подтверждения → DELETE /api/tasks/:id
7. **Спиннеры**: при каждом API-запросе (глобальный + локальные)
8. **Валидация**: пустые поля, корректность дат, на фронте и бэке
 
### Дополнительный (бонус)
9. **Роли**: admin видит и редактирует всё, user — только свои задачи
10. **Поиск**: input с debounce (~300ms), состояние «не найдено»
11. **Пагинация**: по 10 задач на страницу
12. **Фильтры**: по статусу (все/активные/завершённые/просроченные), по дате
13. **Состояния UI**: пустой список, ошибка загрузки, «результаты не найдены»
 
---
 
## Корневой package.json
 
```json
{
  "name": "todo-app",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```
 
---
 
## .env файлы
 
### Корень (.env.example)
```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
API_PORT=3001
FRONTEND_URL=http://localhost:3000
```
 
### frontend/.env.example
```
API_BASE_URL=http://localhost:3001
```
 
---
 
## README.md
 
Должен содержать:
1. Описание проекта и стек
2. Пошаговая инструкция запуска:
   - git clone
   - npm run install:all
   - скопировать .env.example → .env
   - npm run dev
3. Переменные окружения (таблица)
4. Таблица API эндпоинтов (метод, путь, описание, auth required)
5. Скриншот приложения
6. Структура проекта
 
---
 
## Как запускать
 
```bash
git clone <repo>
cd todo-app
npm run install:all
cp .env.example .env
cp frontend/.env.example frontend/.env
npm run dev
```
 
Frontend: http://localhost:3000
Backend:  http://localhost:3001
 
---
 
## Коммиты (чистая история)
 
1. `chore: initial project structure with monorepo setup`
2. `feat(backend): add Express server with CORS and error handling`
3. `feat(backend): add JWT auth endpoint and middleware`
4. `feat(backend): add CRUD endpoints for tasks`
5. `feat(backend): add DTO validation and seed data`
6. `feat(frontend): initialize Nuxt 4 with Tailwind and Pinia`
7. `feat(frontend): add auth store, composable and login page`
8. `feat(frontend): add API utility with 401 interceptor`
9. `feat(frontend): add task components and tasks page`
10. `feat(frontend): add filtering, sorting and search`
11. `feat(frontend): add pagination and empty states`
12. `feat(frontend): add role-based access control`
13. `docs: add README with setup instructions and API docs`
```
 
---