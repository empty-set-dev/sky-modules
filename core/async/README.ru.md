# Утилиты Async

Утилиты для обработки асинхронных операций с обработкой ошибок и отслеживанием задач.

## Установка

```typescript
import { fire, task, handleAsyncError } from '@sky-modules/core/async'
```

## API

### fire(callback, ...args)

Выполняет async callback с автоматической обработкой ошибок (fire-and-forget).

```typescript
fire<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): PromiseLike<void | R>
```

**Параметры:**
- `callback` - Async функция или кортеж `[объект, метод]`
- `args` - Аргументы для передачи в callback

**Возвращает:** Promise, который разрешается по завершении callback

### task(callback, ...args)

Выполняет async callback и отслеживает его как ожидающую задачу.

```typescript
task<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): Promise<R>
```

**Параметры:**
- `callback` - Async функция или кортеж `[объект, метод]`
- `args` - Аргументы для передачи в callback

**Возвращает:** Promise с результатом callback

### handleAsyncError(error)

Обрабатывает ошибки из async операций.

```typescript
handleAsyncError(error: unknown): void
```

**Параметры:**
- `error` - Ошибка из async операции

**Поведение:** Выбрасывает ошибку на клиенте (следующий тик) или на сервере (немедленно)

## Использование

### Fire and Forget

```typescript
fire(async () => {
  await analytics.track('page_view')
  await logger.log('User visited')
})

console.log('Page rendered') // Продолжает выполнение немедленно
```

### Отслеживаемые задачи

```typescript
await task(async () => {
  await loadConfiguration()
  await connectDatabase()
})
```

### С методами объектов

```typescript
class API {
  async fetchData() {
    return await fetch('/api/data')
  }
}

const api = new API()

fire([api, api.fetchData])
await task([api, api.fetchData])
```

## fire() vs task()

Используйте `fire()` для:
- Фоновых задач
- Аналитики/логирования
- Некритичных операций

Используйте `task()` для:
- Кода инициализации
- Критичных операций
- Когда рантайм должен ждать
