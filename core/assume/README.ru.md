# Assume

Утверждения типов без проверки во время выполнения - скажите TypeScript довериться вам без валидации.

## Установка

```typescript
import assume from '@sky-modules/core/assume'
```

## API

### assume<T>(value)

Утверждает, что значение имеет тип T без проверки во время выполнения.

```typescript
assume<T>(value: unknown): asserts value is T
```

**Параметры:**
- `value` - Значение для утверждения типа

**Эффект типизации:** Сужает `value` до типа `T`

**Эффект выполнения:** Отсутствует (no-op, компилируется в ничто)

## Использование

```typescript
const data: unknown = JSON.parse(response)

assume<User>(data)

// TypeScript теперь считает data типом User
console.log(data.name)
console.log(data.email)
```

## Примеры

### После валидации

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
})

function parseUser(json: string): User {
  const data: unknown = JSON.parse(json)
  UserSchema.parse(data) // Проверка во время выполнения
  assume<User>(data) // Теперь безопасно утверждать
  return data
}
```

### Приведение типа

```typescript
function cast<T>(value: unknown): T {
  assume<T>(value)
  return value
}

const user = cast<User>(rawData)
```

## Предупреждение

⚠️ **Нет проверки во время выполнения!**

```typescript
// ОПАСНО - Нет валидации
const data: unknown = await fetch('/api/user').then(r => r.json())
assume<User>(data)
// Если API вернёт неправильную структуру, будут ошибки во время выполнения!
```

## Когда использовать

Безопасное использование:
- После ручной валидации
- После валидации схемой (zod, yup, и т.д.)
- С доверенными внутренними данными

Избегать:
- Пользовательский ввод
- Внешние API
- Когда не уверены в типе
