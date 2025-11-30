# Fetch

Расширенный fetch API с удобными помощниками для распространенных паттернов.

## Установка

```typescript
import '@sky-modules/core/fetch'
```

## API

### fetch.call(url, init?)

Выполнить запрос fetch с необязательными параметрами.

```typescript
fetch.call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response>
```

**Параметры:**
- `url` - URL запроса
- `init` - Необязательная инициализация запроса

**Возвращает:** Promise<Response>

### fetch.json(url, init?)

Выполнить запрос fetch и распарсить JSON ответ.

```typescript
fetch.json<T>(url: RequestInfo | URL, init?: FetchRequestInit): Promise<T>
```

**Параметры:**
- `url` - URL запроса
- `init` - Необязательная инициализация запроса

**Возвращает:** Promise<T>

### fetch.text(url, init?)

Выполнить запрос fetch и получить текстовый ответ.

```typescript
fetch.text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string>
```

**Параметры:**
- `url` - URL запроса
- `init` - Необязательная инициализация запроса

**Возвращает:** Promise<string>

### FetchRequestInit

Расширенный RequestInit с поддержкой params.

```typescript
interface FetchRequestInit extends Omit<RequestInit, 'body'> {
  params?: Record<string, unknown>
}
```

**Свойства:**
- `params` - Объект параметров запроса (добавляется к URL для GET запросов)

## Примеры использования

### Получение JSON данных

```typescript
import '@sky-modules/core/fetch'

const data = await fetch.json<User>('/api/users/123')
console.log(data.name)
```

### Получение текста

```typescript
const html = await fetch.text('/api/html-template')
console.log(html)
```

### GET с параметрами запроса

```typescript
const response = await fetch.call('/api/search', {
  params: { q: 'typescript', limit: 10 }
})
// URL становится: /api/search?q=typescript&limit=10
```

### POST с заголовками

```typescript
const data = await fetch.json('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  params: { name: 'John', email: 'john@example.com' }
})
```

### С учетными данными

```typescript
const data = await fetch.json('/api/protected', {
  credentials: 'include',
  params: { token: 'xyz' }
})
```

## Примечания

- `params` конвертируются в query строку для GET запросов
- `params` конвертируются в JSON body для не-GET запросов
- Null/undefined значения в params пропускаются
- Все помощники используют нативный fetch под капотом
