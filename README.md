# EduFlow

EduFlow — веб-платформа для управления учебным процессом. Система разделяет рабочие пространства студентов, преподавателей и администратора: от назначения на курс до проверки домашнего задания и выставления оценки.

## Возможности

- публичный каталог программ и заявка на обучение через Telegram;
- регистрация студентов и вход по JWT;
- кабинет администратора: создание преподавателей, назначения на курсы, запись студентов, блокировка и сброс временных паролей;
- кабинет преподавателя: программа курса до 12 уроков, материалы, домашние задания, проверка работ, оценка или возврат на доработку;
- кабинет студента: текущий курс, материалы уроков, задания в статусах «к выполнению / на проверке / выполнены», прикрепление файлов и оценки;
- загрузка PDF, DOC и DOCX файлов до 15 МБ;
- журнал административных действий и уведомления в интерфейсе.

## Технологии

| Часть | Технологии |
| --- | --- |
| Клиент | React, TypeScript, Vite |
| API | ASP.NET Core Web API (.NET 10) |
| Данные | PostgreSQL, Entity Framework Core, Npgsql |
| Авторизация | JWT, BCrypt.Net |
| Документация API | Swagger / OpenAPI |

## Структура

```text
.
├── frontend/                  # React-клиент
│   ├── src/                   # страницы, компоненты и стили
│   └── .env.example           # пример конфигурации клиента
├── backend/                   # ASP.NET Core API
│   ├── Migrations/            # миграции EF Core
│   ├── wwwroot/uploads/       # локально загруженные файлы (не хранить в Git)
│   └── .env.example           # пример серверных переменных
└── docker-compose.yml         # PostgreSQL в Docker (необязательно)
```

## Требования

- .NET SDK 10;
- Node.js 20 или новее;
- PostgreSQL 16 или Docker Desktop;
- npm.

## Локальный запуск

### 1. Запуск PostgreSQL

Можно использовать свою локальную PostgreSQL базу или Docker:

```powershell
docker compose up -d postgres
```

### 2. Настройка и запуск API

Создайте `backend/appsettings.Development.json` и укажите строку подключения и JWT-ключ:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=eduflow;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "local-development-key-at-least-32-characters"
  },
  "Seed": {
    "AdminPassword": "choose-a-local-development-password"
  }
}
```

В первом терминале:

```powershell
cd backend
dotnet run
```

При запуске автоматически применяются миграции. Swagger доступен по адресу `http://localhost:5000/swagger`.

### 3. Настройка и запуск клиента

Во втором терминале:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Откройте `http://localhost:5173`.

Переменные клиента в `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_TELEGRAM_CONTACT=https://t.me/your_username
```

## Сборка для production

### Frontend

```powershell
cd frontend
npm run build
```

Готовые статические файлы появятся в `frontend/dist`.

### Backend

```powershell
cd backend
dotnet publish -c Release -o ./publish
```

Готовое API будет находиться в `backend/publish`. Для хостинга задайте переменные окружения:

```text
ConnectionStrings__DefaultConnection=...
Jwt__Key=...
Jwt__Issuer=EduFlow
Jwt__Audience=EduFlow
Cors__Origin=https://your-frontend-domain.example
```

Для production используйте HTTPS, отдельную PostgreSQL базу, уникальный JWT-ключ длиной не менее 32 символов и внешнее файловое хранилище вместо локального `wwwroot/uploads`.

## Проверка качества

```powershell
# frontend
cd frontend
npm run lint
npm run build

# backend
cd ../backend
dotnet build
```

## Безопасность и данные

- `appsettings.Development.json`, `.env`, логи, собранные файлы и пользовательские загрузки исключены из Git;
- пароли хранятся в виде BCrypt-хешей;
- API использует JWT и ролевую авторизацию;
- перед публикацией репозитория не добавляйте реальные пароли, JWT-ключи и пользовательские документы.
