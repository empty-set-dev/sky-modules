# Deferred

Создание promise с внешне доступными функциями resolve и reject.

## Установка

```typescript
import deferred from '@sky-modules/core/deferred'
```

## API

### deferred<T>()

Создаёт отложенный promise.

```typescript
deferred<T = void>(): [
  Promise<T>,
  (value: T | PromiseLike<T>) => void,
  (reason?: unknown) => void
]
```

**Параметры типа:**
- `T` - Тип значения promise (по умолчанию `void`)

**Возвращает:** Кортеж `[promise, resolve, reject]`
- `promise` - Promise, который можно контролировать извне
- `resolve` - Функция для разрешения promise
- `reject` - Функция для отклонения promise

## Использование

### Базовое использование

```typescript
const [promise, resolve, reject] = deferred<string>()

// Разрешить из внешнего кода
setTimeout(() => resolve('Hello'), 1000)

const value = await promise // 'Hello'
```

### Разрешение по событию

```typescript
function waitForEvent(target: EventTarget, eventName: string) {
  const [promise, resolve] = deferred<Event>()
  target.addEventListener(eventName, resolve, { once: true })
  return promise
}

const clickEvent = await waitForEvent(button, 'click')
```

### Ручное управление

```typescript
class AsyncQueue<T> {
  private queue: Array<[Promise<T>, (value: T) => void]> = []

  enqueue(): Promise<T> {
    const [promise, resolve] = deferred<T>()
    this.queue.push([promise, resolve])
    return promise
  }

  dequeue(value: T) {
    const item = this.queue.shift()
    if (item) item[1](value)
  }
}
```

### Async инициализация

```typescript
class Database {
  private initPromise: Promise<void>
  private initResolve!: () => void

  constructor() {
    [this.initPromise, this.initResolve] = deferred<void>()
    this.connect()
  }

  private async connect() {
    await connectToDatabase()
    this.initResolve()
  }

  async query(sql: string) {
    await this.initPromise // Ждать инициализацию
    return executeQuery(sql)
  }
}
```
