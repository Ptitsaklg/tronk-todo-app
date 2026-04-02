# API Specification

Base URL: `http://localhost:3001`

## Авторизация

### POST /api/auth/login
Публичный эндпоинт (без токена).

**Request body:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "usr_1",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

**Response 401:**
```json
{ "message": "Invalid email or password" }
```

---

## Задачи

Все эндпоинты требуют заголовок:
`Authorization: Bearer <token>`

### GET /api/tasks

**Query parameters:**
| Параметр | Тип    | По умолчанию | Описание |
|----------|--------|-------------|----------|
| sort     | string | createdAt   | Поле сортировки: createdAt, dueDate, status |
| order    | string | desc        | Направление: asc, desc |
| status   | string | all         | Фильтр: all, active, completed, overdue |
| search   | string | —           | Поиск по title и description |
| page     | number | 1           | Номер страницы |
| limit    | number | 10          | Задач на странице |

**Response 200:**
```json
{
  "tasks": [
    {
      "id": "tsk_abc123",
      "title": "Купить продукты",
      "description": "Молоко, хлеб, яйца",
      "dueDate": "2025-12-31T00:00:00.000Z",
      "isCompleted": false,
      "createdBy": "usr_1",
      "createdByEmail": "admin@test.com",
      "createdAt": "2025-06-01T10:00:00.000Z",
      "updatedAt": "2025-06-01T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### POST /api/tasks

**Request body:**
```json
{
  "title": "Новая задача",
  "description": "Описание задачи",
  "dueDate": "2025-12-31"
}
```

**Валидация:**
- title — обязательно, от 1 до 200 символов
- description — опционально, до 1000 символов
- dueDate — опционально, валидная дата, не в прошлом

**Response 201:** объект Task
**Response 400:** `{ "message": "Title is required" }`

### PUT /api/tasks/:id

**Request body (все поля опциональны):**
```json
{
  "title": "Обновлённое название",
  "description": "Новое описание",
  "dueDate": "2025-12-31",
  "isCompleted": true
}
```

**Доступ:**
- admin — может редактировать любые задачи
- user — только свои (createdBy === req.user.id)

**Response 200:** обновлённый объект Task
**Response 403:** `{ "message": "Access denied" }`
**Response 404:** `{ "message": "Task not found" }`

### DELETE /api/tasks/:id

**Доступ:** аналогично PUT

**Response 204:** пустой ответ
**Response 403 / 404:** аналогично PUT

---

## Модели данных

### User
```ts
interface User {
  id: string
  email: string
  password: string   // хранится только на бэкенде
  role: 'admin' | 'user'
}
```

### Task
```ts
interface Task {
  id: string
  title: string
  description: string
  dueDate: string | null
  isCompleted: boolean
  createdBy: string
  createdByEmail: string
  createdAt: string
  updatedAt: string
}
```

### JWT Payload
```ts
interface JwtPayload {
  id: string
  email: string
  role: 'admin' | 'user'
}
```

### DTO
```ts
interface LoginDto {
  email: string
  password: string
}

interface CreateTaskDto {
  title: string
  description?: string
  dueDate?: string
}

interface UpdateTaskDto {
  title?: string
  description?: string
  dueDate?: string | null
  isCompleted?: boolean
}
```