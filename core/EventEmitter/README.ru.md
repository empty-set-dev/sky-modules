# EventEmitter

Типобезопасная реализация паттерна event emitter с генерик event maps.

## Обзор

EventEmitter предоставляет надежный, типобезопасный паттерн pub-sub для событийно-ориентированного программирования. Использует TypeScript generics для обеспечения типобезопасности имен событий и их данных, предотвращая runtime ошибки и улучшая developer experience.

**Ключевые возможности:**
- Типобезопасная эмиссия и подписка на события
- Определение generic event map
- "Any" event listeners (подписка на все события)
- API с цепочками методов
- Поддержка расширения функций
- Нулевые зависимости

## Базовое использование

### Определение Event Map

```typescript
import EventEmitter from '@sky-modules/core/EventEmitter'

// Определите вашу event map
interface MyEvents {
  'user:login': (userId: string, timestamp: number) => void
  'user:logout': (userId: string) => void
  'data:update': (data: { id: number; value: string }) => void
  'error': (error: Error) => void
}

// Создать emitter
const emitter = new EventEmitter<MyEvents>()
```

### Подписка на события

```typescript
// Подписаться на события с типобезопасностью
emitter.on('user:login', (userId, timestamp) => {
  console.log(`Пользователь ${userId} вошел в ${timestamp}`)
  // TypeScript знает что userId это string и timestamp это number
})

emitter.on('data:update', (data) => {
  console.log(`Данные обновлены: ${data.id} = ${data.value}`)
  // TypeScript знает что data имеет свойства id и value
})

// Цепочки методов
emitter
  .on('user:login', handler1)
  .on('user:logout', handler2)
  .on('error', errorHandler)
```

### Эмиссия событий

```typescript
// Эмитить события с проверкой типов аргументов
emitter.emit('user:login', 'user123', Date.now())

emitter.emit('data:update', { id: 1, value: 'привет' })

// TypeScript ошибка - неправильные типы аргументов
// emitter.emit('user:login', 123, 'не число')

// TypeScript ошибка - отсутствуют аргументы
// emitter.emit('user:login', 'user123')
```

### Отписка

```typescript
const handler = (userId: string) => {
  console.log(`Пользователь ${userId} вышел`)
}

// Подписаться
emitter.on('user:logout', handler)

// Отписаться от конкретного обработчика
emitter.off('user:logout', handler)

// Отписаться от всех обработчиков
emitter.offAll()
```

## Продвинутое использование

### Any Event Listeners

Слушать все события независимо от типа:

```typescript
// Подписаться на любое событие
emitter.onAny((eventName, ...args) => {
  console.log(`Событие сработало: ${String(eventName)}`, args)
})

// Будет вызван для всех эмиссий
emitter.emit('user:login', 'user123', Date.now())
emitter.emit('user:logout', 'user123')
emitter.emit('data:update', { id: 1, value: 'тест' })
```

**Сценарии использования:**
- Логирование всех событий
- Отладка потока событий
- Отслеживание аналитики
- Системы replay событий

### Расширение классов

Добавить функциональность event emitter к существующим классам:

```typescript
class UserManager extends EventEmitter<MyEvents> {
  private users = new Map<string, User>()

  login(userId: string) {
    // ... логика входа ...
    this.emit('user:login', userId, Date.now())
  }

  logout(userId: string) {
    // ... логика выхода ...
    this.emit('user:logout', userId)
  }
}

const manager = new UserManager()
manager.on('user:login', (userId, timestamp) => {
  console.log(`Событие входа: ${userId} в ${timestamp}`)
})

manager.login('user123')
```

### Расширение функций

Добавить методы event emitter к функциям:

```typescript
interface FunctionEvents {
  'called': (args: unknown[]) => void
  'returned': (result: unknown) => void
}

function myFunction(x: number): number {
  const result = x * 2
  return result
}

// Расширить функцию EventEmitter'ом
const emittingFn = EventEmitter.extend<typeof myFunction, FunctionEvents>(myFunction)

// Подписаться на события функции
emittingFn.on('called', (args) => {
  console.log('Функция вызвана с:', args)
})

emittingFn.on('returned', (result) => {
  console.log('Функция вернула:', result)
})

// Использовать функцию нормально
const result = emittingFn(5)
```

### Ручная инициализация

Для большего контроля над инициализацией:

```typescript
class CustomEmitter extends EventEmitter<MyEvents> {
  constructor() {
    super()
    // Ручная инициализация
    EventEmitter.super(this)
  }
}
```

## Справочник API

### Конструктор

```typescript
new EventEmitter<EventMap>()
```

Создает новый экземпляр EventEmitter с указанной event map.

**Параметры типа:**
- `EventMap` - Объект отображающий имена событий в сигнатуры обработчиков

### Методы

#### `on\<K\>(event, callback)`

Подписаться на событие.

```typescript
on<K extends keyof T>(ev: K, callback: T[K]): this
```

**Параметры:**
- `ev` - Имя события (проверяется против event map)
- `callback` - Функция обработчик (сигнатура принудительно проверяется event map)

**Возвращает:** `this` для цепочек методов

**Пример:**
```typescript
emitter.on('user:login', (userId, timestamp) => {
  // Обработать вход
})
```

#### `onAny(callback)`

Подписаться на все события.

```typescript
onAny<T extends []>(callback: (...args: T) => void): this
```

**Параметры:**
- `callback` - Обработчик получающий имя события и аргументы

**Возвращает:** `this` для цепочек методов

**Пример:**
```typescript
emitter.onAny((eventName, ...args) => {
  console.log(`Событие: ${String(eventName)}`, args)
})
```

#### `off\<K\>(event, callback)`

Отписаться от события.

```typescript
off<K extends keyof T>(ev: K, callback: T[K]): this
```

**Параметры:**
- `ev` - Имя события
- `callback` - Обработчик для удаления (должна быть та же ссылка)

**Возвращает:** `this` для цепочек методов

**Пример:**
```typescript
const handler = (userId) => { /* ... */ }
emitter.on('user:login', handler)
emitter.off('user:login', handler)
```

#### `offAll()`

Отписаться от всех событий.

```typescript
offAll(): this
```

**Возвращает:** `this` для цепочек методов

**Пример:**
```typescript
emitter.offAll() // Удаляет всех слушателей
```

#### `emit\<K\>(event, ...args)`

Эмитить событие всем подписчикам.

```typescript
emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]> & []): this
```

**Параметры:**
- `ev` - Имя события
- `args` - Аргументы события (проверяются против сигнатуры обработчика)

**Возвращает:** `this` для цепочек методов

**Пример:**
```typescript
emitter.emit('user:login', 'user123', Date.now())
```

### Статические методы

#### `EventEmitter.super(self)`

Вручную инициализировать свойства EventEmitter.

```typescript
static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void
```

**Параметры:**
- `self` - Экземпляр EventEmitter для инициализации

**Пример:**
```typescript
class MyEmitter extends EventEmitter<MyEvents> {
  constructor() {
    super()
    EventEmitter.super(this)
  }
}
```

#### `EventEmitter.extend(fn)`

Расширить функцию методами EventEmitter.

```typescript
static extend<T extends Function, E extends { [K in keyof E]: E[K] }>(
  fn: T
): T & EventEmitter<E>
```

**Параметры:**
- `fn` - Функция для расширения

**Возвращает:** Функция с добавленными методами EventEmitter

**Пример:**
```typescript
const fn = (x: number) => x * 2
const emittingFn = EventEmitter.extend<typeof fn, MyEvents>(fn)

emittingFn.on('called', (args) => console.log(args))
```

## Общие паттерны

### Паттерн Request/Response

```typescript
interface RequestEvents {
  'request': (id: string, data: unknown) => void
  'response': (id: string, result: unknown) => void
  'error': (id: string, error: Error) => void
}

const api = new EventEmitter<RequestEvents>()

// Подписчик
api.on('request', async (id, data) => {
  try {
    const result = await processRequest(data)
    api.emit('response', id, result)
  } catch (error) {
    api.emit('error', id, error as Error)
  }
})

// Отправитель запроса
async function makeRequest(data: unknown): Promise<unknown> {
  const id = generateId()

  return new Promise((resolve, reject) => {
    api.on('response', (responseId, result) => {
      if (responseId === id) resolve(result)
    })

    api.on('error', (errorId, error) => {
      if (errorId === id) reject(error)
    })

    api.emit('request', id, data)
  })
}
```

### Конечный автомат

```typescript
interface StateMachineEvents {
  'state:change': (from: string, to: string) => void
  'state:enter': (state: string) => void
  'state:exit': (state: string) => void
}

class StateMachine extends EventEmitter<StateMachineEvents> {
  private currentState: string = 'idle'

  transition(newState: string) {
    const oldState = this.currentState

    this.emit('state:exit', oldState)
    this.emit('state:change', oldState, newState)
    this.currentState = newState
    this.emit('state:enter', newState)
  }
}

const fsm = new StateMachine()

fsm.on('state:enter', (state) => {
  console.log(`Вошли в состояние: ${state}`)
})

fsm.transition('loading')
fsm.transition('ready')
```

### Система плагинов

```typescript
interface PluginEvents {
  'plugin:load': (name: string) => void
  'plugin:unload': (name: string) => void
  'plugin:error': (name: string, error: Error) => void
}

class PluginManager extends EventEmitter<PluginEvents> {
  private plugins = new Map<string, Plugin>()

  load(name: string, plugin: Plugin) {
    try {
      plugin.initialize()
      this.plugins.set(name, plugin)
      this.emit('plugin:load', name)
    } catch (error) {
      this.emit('plugin:error', name, error as Error)
    }
  }

  unload(name: string) {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.cleanup()
      this.plugins.delete(name)
      this.emit('plugin:unload', name)
    }
  }
}
```

### Event Bus

```typescript
// Глобальная шина событий
interface GlobalEvents {
  'app:ready': () => void
  'user:action': (action: string, data: unknown) => void
  'notification': (message: string, level: 'info' | 'warning' | 'error') => void
}

class EventBus extends EventEmitter<GlobalEvents> {
  private static instance: EventBus

  static getInstance(): EventBus {
    if (!this.instance) {
      this.instance = new EventBus()
    }
    return this.instance
  }

  private constructor() {
    super()
  }
}

// Использование в приложении
const bus = EventBus.getInstance()

// Модуль A
bus.on('user:action', (action, data) => {
  analytics.track(action, data)
})

// Модуль B
bus.emit('user:action', 'button-click', { buttonId: 'submit' })
```

## Типобезопасность

EventEmitter обеспечивает полную типобезопасность:

```typescript
interface Events {
  'typed': (x: number, y: string) => void
  'untyped': () => void
}

const emitter = new EventEmitter<Events>()

// ✅ Правильно
emitter.on('typed', (x, y) => {
  // x это number, y это string
})
emitter.emit('typed', 42, 'привет')

// ❌ TypeScript ошибки
emitter.on('typed', (x: string) => {})  // Неправильный тип
emitter.emit('typed', 'неправильно', 42)      // Неправильные типы аргументов
emitter.emit('typed', 42)               // Отсутствует аргумент
emitter.emit('unknown', 123)            // Неизвестное событие
```

## Соображения производительности

### Управление памятью

```typescript
// Не забывайте отписываться для предотвращения утечек памяти
class Component extends EventEmitter<MyEvents> {
  private cleanup: (() => void)[] = []

  onMount() {
    const handler = () => { /* ... */ }
    this.on('update', handler)

    // Сохранить функцию очистки
    this.cleanup.push(() => this.off('update', handler))
  }

  onUnmount() {
    // Очистить все подписки
    this.cleanup.forEach(fn => fn())
    this.cleanup = []
  }
}
```

### Дедупликация обработчиков

```typescript
// Избегать дублирования обработчиков
const handler = () => console.log('сработало')

emitter.on('event', handler)
emitter.on('event', handler)  // Та же ссылка - не дублируется

// Для дубликатов используйте разные экземпляры функций
emitter.on('event', () => console.log('сработало'))
emitter.on('event', () => console.log('сработало'))  // Разные экземпляры
```

### Пакетные операции

```typescript
// Пакетная подписка на события
function setupListeners(emitter: EventEmitter<MyEvents>) {
  return emitter
    .on('event1', handler1)
    .on('event2', handler2)
    .on('event3', handler3)
}
```

## Тестирование

```typescript
import { describe, it, expect } from 'vitest'
import EventEmitter from '@sky-modules/core/EventEmitter'

describe('EventEmitter', () => {
  it('должен эмитить и получать события', () => {
    interface TestEvents {
      'test': (value: number) => void
    }

    const emitter = new EventEmitter<TestEvents>()
    let received: number | undefined

    emitter.on('test', (value) => {
      received = value
    })

    emitter.emit('test', 42)

    expect(received).toBe(42)
  })

  it('должен отписывать обработчики', () => {
    const emitter = new EventEmitter<{ 'test': () => void }>()
    let count = 0

    const handler = () => { count++ }

    emitter.on('test', handler)
    emitter.emit('test')
    expect(count).toBe(1)

    emitter.off('test', handler)
    emitter.emit('test')
    expect(count).toBe(1) // Не увеличился
  })
})
```

## Лучшие практики

### 1. Определяйте четкие Event Maps

```typescript
// Хорошо - описательные имена событий с namespace
interface UserEvents {
  'user:created': (user: User) => void
  'user:updated': (user: User, changes: Partial<User>) => void
  'user:deleted': (userId: string) => void
}

// Избегайте - расплывчатые имена
interface BadEvents {
  'change': (data: any) => void
  'update': () => void
}
```

### 2. Используйте типобезопасные данные

```typescript
// Хорошо - строгая типизация
interface GoodEvents {
  'data:loaded': (data: { items: Item[]; total: number }) => void
}

// Избегайте - any типы
interface BadEvents {
  'data:loaded': (data: any) => void
}
```

### 3. Очищайте подписки

```typescript
// Хорошо - очистка при unmount/destroy
class Component {
  private emitter = new EventEmitter<Events>()

  destroy() {
    this.emitter.offAll()
  }
}
```

### 4. Документируйте контракты событий

```typescript
/**
 * События эмитируемые DataService
 *
 * @event data:fetch - Эмитится когда начинается загрузка данных
 * @event data:success - Эмитится когда загрузка данных успешна
 * @event data:error - Эмитится когда загрузка данных провалилась
 */
interface DataServiceEvents {
  'data:fetch': (url: string) => void
  'data:success': (data: unknown) => void
  'data:error': (error: Error) => void
}
```

## Связанные модули

- [core/Array](../Array/) - Утилиты массивов включая метод `remove`
- [core/PromisePool](../PromisePool/) - Конкурентное выполнение промисов
- [core/type-guards](../type-guards/) - Утилиты type guard

## Примеры

См. [EventEmitter.spec.ts](./EventEmitter.spec.ts) для полных примеров использования и тестовых кейсов.
