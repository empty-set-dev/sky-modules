# Утилиты Async Creation

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  async-creation utility module
</div>

Утилиты для создания асинхронных операций с паттернами ожидания и инициализации.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import { when, init } from '@sky-modules/core/async-creation'
```

## API

### when(object, callback?, ...args)

Ожидает завершения асинхронных операций и опционально вызывает callback с результатами.

```typescript
when<T extends Awaitable<unknown> | readonly Awaitable<unknown>[], A extends unknown[]>(
  object: T,
  callback?: Callback<[WhenResult<T>, ...A], void | Promise<void>>,
  ...args: A
): PromiseLike<WhenResult<T>>
```

**Параметры:**
- `object` - Promise, объект со свойством `whenReady` или массив awaitables
- `callback` - Опциональный callback, вызываемый с результатами
- `args` - Дополнительные аргументы для callback

**Возвращает:** Promise, разрешающийся в результаты ожидания

**Примечание:** Внутри использует `task()`, поэтому безопасно не ждать - ошибки будут обработаны через `handleAsyncError`

### init(instance, ...args)

Инициализирует объект, вызывая его метод `init()` с аргументами.

```typescript
init<T extends { init(...args: A): Promise<void> }, A extends unknown[]>(
  instance: T,
  ...args: A
): Promise<T>
```

**Параметры:**
- `instance` - Объект с методом `init()`
- `args` - Аргументы для передачи в `init()`

**Возвращает:** Promise, разрешающийся в тот же объект после инициализации

## Использование

### Ожидание одного Promise

```typescript
const data = await when(fetchData())
console.log(data)
```

### Ожидание нескольких Promise

```typescript
const results = await when([
  loadConfig(),
  loadDatabase(),
  loadCache()
])

console.log(results) // [configData, dbData, cacheData]
```

### С callback

```typescript
await when(fetchUserData(), (userData) => {
  console.log('Пользователь загружен:', userData.name)
})
```

### Инициализация объектов

```typescript
class Service {
  async init(url: string) {
    this.connection = await connect(url)
  }
}

const service = await init(new Service(), 'http://localhost:3000')
```

### Fire-and-Forget (Безопасно без await)

```typescript
// Безопасно не ждать - ошибки отслеживаются и обрабатываются
when(loadUserPreferences(), (prefs) => {
  applyPreferences(prefs)
})

// Продолжить немедленно без блокировки
console.log('Загрузка настроек в фоне...')
```
