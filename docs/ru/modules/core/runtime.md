# runtime

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  runtime utility module
</div>

Утилиты для управления состоянием приложения и инициализацией рантайма.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import runtime from '@sky-modules/core/runtime'
import isRuntime from '@sky-modules/core/runtime/isRuntime'
import startRuntime from '@sky-modules/core/runtime/startRuntime'
```

## API

### runtime

Promise, который разрешается когда рантайм готов.

```typescript
const runtime: Promise<void>
```

**Возвращает:** Promise, разрешающийся после завершения `startRuntime()`

### isRuntime()

Проверяет, активен ли режим рантайма.

```typescript
isRuntime(): boolean
```

**Возвращает:** `true` если рантайм активен, `false` иначе

### startRuntime()

Инициализирует рантайм после ожидания завершения всех ожидающих async задач.

```typescript
startRuntime(): Promise<void>
```

**Поведение:** Ждет завершения всех вызовов `fire()` и `task()` перед установкой состояния рантайма

## Использование

### Проверка статуса рантайма

```typescript
if (!isRuntime()) {
  console.log('Приложение инициализируется...')
}

await runtime
console.log('Приложение готово')
```

### Последовательность инициализации

```typescript
// Определяем модули во время фазы инициализации
define('UserService', () => new UserService())
define('Config', () => loadConfig())

// Запускаем рантайм после всех определений
await startRuntime()

// Теперь рантайм активен
if (isRuntime()) {
  console.log('Все модули инициализированы')
}
```

### Ожидание рантайма

```typescript
async function setupUI() {
  await runtime
  console.log('Безопасно отрендерить UI')
}
```
