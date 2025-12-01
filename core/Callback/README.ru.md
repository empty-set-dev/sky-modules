# Callback

Унифицированный тип для функций и методов объектов с сохранением контекста `this`.

## Установка

```typescript
import { type Callback, invokeCallback } from '@sky-modules/core'
```

## API

### Callback\<A, R\>

Тип для callback-функций или кортежей `[объект, метод]`.

```typescript
type Callback<A extends unknown[], R> =
  | ((...args: A) => R)
  | readonly [object, (...args: A) => R]
```

**Параметры типа:**
- `A` - Массив типов аргументов
- `R` - Тип возвращаемого значения

### invokeCallback(callback, ...args)

Вызывает callback с правильным контекстом `this`.

```typescript
invokeCallback<A extends unknown[], R>(
  callback: Callback<A, R>,
  ...args: A
): R
```

**Параметры:**
- `callback` - Функция или кортеж `[объект, метод]` для вызова
- `args` - Аргументы для передачи в callback

**Возвращает:** Результат вызова callback

## Использование

### Функция

```typescript
const add = (a: number, b: number) => a + b
invokeCallback(add, 2, 3) // 5
```

### Метод объекта

```typescript
class Logger {
  prefix = '[LOG]'
  log(message: string) {
    console.log(this.prefix, message)
  }
}

const logger = new Logger()
invokeCallback([logger, logger.log], 'Hello') // [LOG] Hello
```

### Универсальная функция

```typescript
function execute<T>(callback: Callback<[string], T>, value: string): T {
  return invokeCallback(callback, value)
}

const upper = (s: string) => s.toUpperCase()
execute(upper, 'hello') // 'HELLO'

class Formatter {
  format(s: string) {
    return `[${s}]`
  }
}
const fmt = new Formatter()
execute([fmt, fmt.format], 'hello') // '[hello]'
```
