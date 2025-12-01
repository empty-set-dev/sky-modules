# Hooks

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  hooks utility module
</div>

Система хуков для перехвата и цепочки вызовов методов с функциональностью подобной middleware.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import { hook, withHooks } from '@sky-modules/core/hooks'
```

## API

### Hook

Определение типа для функций хуков.

```typescript
type Hook = ((
  this: unknown,
  next: (this: unknown, ...args: unknown[]) => void,
  ...args: unknown[]
) => void) & { next: Hook }
```

**Свойства:**
- `next` - Следующий хук в цепи

### AnyHook

Хук который обрабатывает любой тип события.

```typescript
type AnyHook = ((
  this: unknown,
  next: (this: unknown, ...args: unknown[]) => void,
  eventName: string,
  ...args: unknown[]
) => void) & { next: Hook }
```

### HooksOwner

Интерфейс для объектов которые поддерживают хуки.

```typescript
type HooksOwner = Record<PropertyKey, (...args: unknown[]) => void> & {
  __hooks: Record<PropertyKey, Hook> & { onAny?: AnyHook }
  __bakedHooks: Record<
    PropertyKey,
    (eventName: string, callback: Callback<unknown[], unknown>, ...args: unknown[]) => unknown
  >
}
```

### hook(prototype, key, descriptor)

Зарегистрировать хук на методе прототипа.

```typescript
hook(prototype: object, k: PropertyKey, descriptor: PropertyDescriptor): void
```

**Параметры:**
- `prototype` - Прототип класса
- `k` - Ключ метода
- `descriptor` - Дескриптор свойства с функцией хука

**Поведение:**
- Добавляет хук в цепь хуков метода
- Создает отдельную цепь __hooks для каждого уровня класса
- Компилирует хуки при первом вызове

**Возвращает:** void

### withHooks(eventType, hooksOwner, callback, ...args)

Выполнить callback с применением хуков.

```typescript
withHooks<A extends unknown[], R, H>(
  eventType: string,
  hooksOwner: H,
  callback: Callback<A, R>,
  ...args: A
): R
```

**Параметры:**
- `eventType` - Название события хука
- `hooksOwner` - Объект с хуками
- `callback` - Функция для выполнения
- `args` - Аргументы для передачи в callback

**Возвращает:** Возвращаемое значение callback

## Примеры использования

### Создание класса с хуками

```typescript
import { hook } from '@sky-modules/core/hooks'

class API {
  __hooks = {}
  __bakedHooks = {}

  @hook
  async fetchData(id: string) {
    return await fetch(`/api/data/${id}`).then(r => r.json())
  }
}
```

### Добавление хуков к методам

```typescript
const api = new API()

// Добавить логирующий хук
api.__hooks.fetchData = function(next, ...args) {
  console.log('Перед запросом:', args)
  next(...args)
  console.log('После запроса')
}
```

### Использование withHooks для выполнения

```typescript
import { withHooks } from '@sky-modules/core/hooks'

const result = withHooks(
  'fetchData',
  api,
  async (id) => {
    return await api.fetchData(id)
  },
  '123'
)
```

### Цепь хуков

```typescript
// Первый хук
api.__hooks.processData = function(next, data) {
  console.log('Хук 1: Начало')
  next(data)
  console.log('Хук 1: Конец')
}

// Второй хук (добавлен позже)
api.__hooks.processData.next = function(next, data) {
  console.log('Хук 2: Начало')
  next(data)
  console.log('Хук 2: Конец')
}

// Оба хука выполняются по порядку
```

### Универсальный хук (onAny)

```typescript
api.__hooks.onAny = function(next, eventName, ...args) {
  console.log(`Событие: ${eventName}`)
  next(...args)
}
```

## Примечания

- Хуки образуют цепь, каждый вызывает `next()` для продолжения
- Несколько хуков на одном методе стекируются
- Хуки компилируются при первом использовании для производительности
- Работает с async и sync методами
- Контекст (this) сохраняется через цепь хуков
