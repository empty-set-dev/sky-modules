# Utility Types

Продвинутые TypeScript утилиты типов для трансформаций типов.

## Установка

```typescript
import type { DeepPartial, UnionToIntersection, UnionToTuple } from '@sky-modules/core/utility-types'
```

## API

### DeepPartial\<T\>

Сделать все свойства в T опциональными рекурсивно.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

**Параметры типа:**
- `T` - Тип объекта для частичного заполнения

**Поведение:**
- Рекурсивно делает все вложенные свойства опциональными
- Работает с вложенными объектами, массивами и сложными структурами
- Сохраняет безопасность типов через рекурсию

### UnionToIntersection\<U\>

Преобразовать union тип в intersection тип.

```typescript
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
```

**Параметры типа:**
- `U` - Union тип для преобразования

**Поведение:**
- Трансформирует `A | B | C` в `A & B & C`
- Полезно для объединения типов из union
- Использует контравариантность функций для вывода типов

### UnionToTuple\<U\>

Преобразовать union тип в tuple тип.

```typescript
type UnionToTuple<U> =
  UnionToIntersection<U extends unknown ? (u: U) => void : never> extends (v: infer V) => void
    ? [...UnionToTuple<Exclude<U, V>>, V]
    : []
```

**Параметры типа:**
- `U` - Union тип для преобразования

**Поведение:**
- Трансформирует `A | B | C` в `[A, B, C]`
- Создает tuple с каждым членом union
- Рекурсивная реализация используя UnionToIntersection

## Примеры использования

### DeepPartial для объектов конфигурации

```typescript
interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
    headers: {
      authorization: string
      'content-type': string
    }
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

type PartialConfig = DeepPartial<AppConfig>

const config: PartialConfig = {
  api: {
    baseUrl: 'https://api.example.com'
    // timeout и headers опциональны
  }
  // cache опционален
}
```

### UnionToIntersection для объединения типов

```typescript
type Identifiable = { id: string }
type Timestamped = { createdAt: Date }
type Named = { name: string }

type Combined = UnionToIntersection<Identifiable | Timestamped | Named>
// Результат: { id: string } & { createdAt: Date } & { name: string }

const obj: Combined = {
  id: '1',
  createdAt: new Date(),
  name: 'Item'
}
```

### UnionToTuple для проверки исчерпывающести

```typescript
type Status = 'pending' | 'active' | 'completed' | 'failed'

type StatusTuple = UnionToTuple<Status>
// Результат: ['pending', 'active', 'completed', 'failed'] (или похожий порядок)

function processAllStatuses(statuses: StatusTuple) {
  statuses.forEach(status => {
    console.log(`Обработка: ${status}`)
  })
}
```

### Вложенный DeepPartial

```typescript
interface User {
  profile: {
    personal: {
      firstName: string
      lastName: string
    }
    contact: {
      email: string
      phone: string
    }
  }
  settings: {
    theme: string
    notifications: boolean
  }
}

type PartialUser = DeepPartial<User>

const update: PartialUser = {
  profile: {
    personal: {
      firstName: 'John'
      // lastName опционален
    }
    // contact опционален
  }
  // settings опционален
}
```

### Родовая функция с DeepPartial

```typescript
function mergeConfig<T extends object>(
  defaults: T,
  overrides: DeepPartial<T>
): T {
  return deepMerge(defaults, overrides)
}

const config = mergeConfig(
  { api: { timeout: 5000, retries: 3 } },
  { api: { timeout: 10000 } }
)
```

## Примечания

- Все типы зарегистрированы глобально в глобальном namespace
- Нет накладных расходов во время выполнения - чистые трансформации типов на этапе компиляции
- Полезно для отображения ответов API и объединения конфигураций
- DeepPartial рекурсивный - безопасен для глубоко вложенных структур
- UnionToIntersection требует понимания условных типов
- UnionToTuple сохраняет члены union в форме tuple для проверки исчерпывающести
