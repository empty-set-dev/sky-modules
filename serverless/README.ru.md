# Модуль Serverless

Шаблоны и утилиты для развертывания приложений на Cloudflare Workers с Hono и Vike SSR.

## Установка

```bash
npm install @sky-modules/serverless
npm install hono vike
```

## Возможности

- **Интеграция Hono**: Типобезопасный веб-фреймворк для Cloudflare Workers
- **Vike SSR**: Серверный рендеринг с Vike
- **Cloudflare Bindings**: Типобезопасный доступ к KV, D1, R2 и другим сервисам
- **Геолокация**: Встроенный доступ к метаданным запросов Cloudflare
- **Шаблонная архитектура**: Предварительно настроенная структура файлов для быстрой настройки

## Быстрый старт

### 1. Настройка Hono приложения

Создайте `src/lib/hono.ts`:

```typescript
import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
import { vikeHandler } from './vike-handler'

// Определение Cloudflare bindings
type Bindings = {
    MY_KV: KVNamespace
    MY_DB: D1Database
}

// Определение переменных middleware
type Variables = {
    user: User
}

export type HonoEnv = {
    Bindings: Bindings
    Variables: Variables
}

const app = new Hono<HonoEnv>()

// API маршруты
app.get('/api/hello', c => {
    return c.json({
        message: 'Привет от Cloudflare Workers!',
        location: {
            city: c.req.raw?.cf?.city,
            country: c.req.raw?.cf?.country,
        },
    })
})

// SSR fallback
app.get('*', vikeHandler)

showRoutes(app) // Отладка маршрутов в режиме разработки
export default app
```

### 2. Настройка Vike Handler

Создайте `src/lib/vike-handler.ts`:

```typescript
import { renderPage } from 'vike/server'
import type { Context } from 'hono'

export const vikeHandler = async (c: Context) => {
    const pageContext = await renderPage({
        urlOriginal: c.req.url,
        headersOriginal: Object.fromEntries(c.req.raw.headers),
        request: c.req.raw,
    })

    if (pageContext.httpResponse) {
        const { statusCode, body, contentType } = pageContext.httpResponse
        c.status(statusCode)
        c.header('Content-Type', contentType)
        return c.body(body)
    }

    return c.text('Not Found', 404)
}
```

### 3. Настройка точки входа Worker

Создайте `src/worker.ts`:

```typescript
import app from './lib/hono'

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return app.fetch(request, env, ctx)
    },
}

export type { HonoEnv } from './lib/hono'
```

### 4. Настройка wrangler.toml

```toml
name = "my-app"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

# KV Namespace
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-id"

# D1 Database
[[d1_databases]]
binding = "MY_DB"
database_name = "my-database"
database_id = "your-db-id"
```

## Архитектура

### Поток запроса

```
Запрос → Worker → Роутер Hono → API или Vike Handler → Ответ
```

1. Запрос попадает в Cloudflare Worker
2. Роутер Hono сопоставляет маршрут
3. API маршруты возвращают JSON напрямую
4. Другие маршруты идут в Vike для SSR
5. Ответ отправляется обратно через Cloudflare edge

### Структура файлов

```
src/
├── lib/
│   ├── hono.ts           # Конфигурация Hono приложения
│   └── vike-handler.ts   # Интеграция Vike SSR
├── pages/                # Страницы Vike
│   ├── index/
│   │   └── +Page.tsx
│   └── about/
│       └── +Page.tsx
└── worker.ts             # Точка входа Worker
```

## Примеры API

### Базовый API маршрут

```typescript
app.get('/api/data', async c => {
    const data = await fetchData()
    return c.json({ data })
})

app.post('/api/submit', async c => {
    const body = await c.req.json()
    return c.json({ success: true, data: body })
})
```

### Использование Cloudflare Bindings

```typescript
// KV хранилище
app.get('/api/cache/:key', async c => {
    const key = c.req.param('key')
    const value = await c.env.MY_KV.get(key)
    return c.json({ key, value })
})

app.put('/api/cache/:key', async c => {
    const key = c.req.param('key')
    const { value } = await c.req.json()
    await c.env.MY_KV.put(key, value)
    return c.json({ success: true })
})

// D1 база данных
app.get('/api/users', async c => {
    const result = await c.env.MY_DB
        .prepare('SELECT * FROM users')
        .all()
    return c.json(result.results)
})
```

### Геолокация Cloudflare

```typescript
app.get('/api/location', c => {
    const cf = c.req.raw?.cf
    return c.json({
        city: cf?.city,
        country: cf?.country,
        region: cf?.region,
        timezone: cf?.timezone,
        latitude: cf?.latitude,
        longitude: cf?.longitude,
        colo: cf?.colo, // Местоположение edge сервера
    })
})
```

### Middleware

```typescript
// Middleware аутентификации
app.use('*', async (c, next) => {
    const token = c.req.header('Authorization')
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('user', await verifyToken(token))
    await next()
})

// CORS middleware
app.use('*', async (c, next) => {
    await next()
    c.header('Access-Control-Allow-Origin', '*')
})
```

## Интеграция Vike SSR

### Компонент страницы

```typescript
// pages/index/+Page.tsx
export default function Page({ data }) {
    return (
        <div>
            <h1>Привет от SSR!</h1>
            <p>Данные: {data.message}</p>
        </div>
    )
}
```

### Загрузка данных

```typescript
// pages/index/+data.ts
export async function data(pageContext) {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
}
```

### Доступ к запросу в Vike

```typescript
// pages/index/+data.ts
export async function data(pageContext) {
    const request = pageContext.request as Request
    const cf = request.cf

    return {
        location: {
            city: cf?.city,
            country: cf?.country,
        },
    }
}
```

## Развертывание

### Разработка

```bash
npm run dev
# или
wrangler dev
```

### Продакшн

```bash
wrangler deploy
```

### Переменные окружения

```toml
# wrangler.toml
[vars]
API_URL = "https://api.example.com"
DEBUG = "false"

# Секреты (используйте wrangler secret)
# wrangler secret put API_KEY
```

## Продвинутые паттерны

### Ограничение частоты запросов

```typescript
const rateLimit = new Map<string, number>()

app.use('/api/*', async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const count = rateLimit.get(ip) || 0

    if (count > 100) {
        return c.json({ error: 'Rate limit exceeded' }, 429)
    }

    rateLimit.set(ip, count + 1)
    await next()
})
```

### Обработка ошибок

```typescript
app.onError((err, c) => {
    console.error('Ошибка:', err)
    return c.json({
        error: 'Internal Server Error',
        message: err.message,
    }, 500)
})
```

### Поддержка WebSocket

```typescript
app.get('/ws', c => {
    const upgradeHeader = c.req.header('Upgrade')
    if (upgradeHeader !== 'websocket') {
        return c.text('Expected WebSocket', 400)
    }

    const [client, server] = Object.values(new WebSocketPair())
    server.accept()

    server.addEventListener('message', event => {
        server.send(`Echo: ${event.data}`)
    })

    return new Response(null, {
        status: 101,
        webSocket: client,
    })
})
```

## Лучшие практики

1. **Типобезопасность**: Всегда определяйте типы Bindings и Variables
2. **Обработка ошибок**: Используйте try-catch и onError handler
3. **Логирование**: Используйте console.log для логов Cloudflare
4. **Edge кэширование**: Используйте Cache API для статических ресурсов
5. **Холодные старты**: Минимизируйте размер worker для быстрых холодных стартов
6. **Тестирование**: Используйте wrangler dev для локального тестирования

## Сервисы Cloudflare

### Доступные Bindings

- **KV**: Key-value хранилище (низкая задержка чтения)
- **R2**: Объектное хранилище (S3-совместимое)
- **D1**: SQL база данных (SQLite)
- **Durable Objects**: Stateful workers
- **Queues**: Очереди сообщений
- **Analytics Engine**: Аналитические данные
- **Workers AI**: AI inference

## Связанные модули

- **[Документация Hono](https://hono.dev/)**
- **[Документация Vike](https://vike.dev/)**
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)**
- **[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)**

## Лицензия

MIT
