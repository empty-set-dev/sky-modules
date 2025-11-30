# transform

Система цепочки трансформаций для преобразования значений между форматами.

## Установка

```typescript
import { transform, defineTransform, to, from } from '@sky-modules/core/transform'
```

## API

### defineTransform(type, toFn, fromFn)

Регистрирует новый формат трансформации.

```typescript
defineTransform<To, From, A extends unknown[]>(
  type: string,
  toFn: (value: From, ...args: A) => To,
  fromFn: (value: To, ...args: A) => From
): void
```

**Параметры:**
- `type` - Имя формата трансформации
- `toFn` - Функция для преобразования из исходного формата в целевой
- `fromFn` - Функция для преобразования обратно из целевого формата в исходный

### transform.transform()

Применяет зарегистрированные трансформации по порядку.

```typescript
transform.transform(value: unknown): unknown
```

**Параметры:**
- `value` - Значение для трансформации

**Возвращает:** Трансформированное значение

### transform.untransform()

Отменяет все трансформации в обратном порядке.

```typescript
transform.untransform(value: unknown): unknown
```

**Параметры:**
- `value` - Значение для отмены трансформации

**Возвращает:** Исходное значение

## Встроенные трансформации

- **json** - Преобразование в/из JSON строк
- **base64** - Кодирование/декодирование Base64 строк

## Использование

### JSON трансформация

```typescript
const json = transform.json.transform({ name: 'John' })
console.log(json) // '{"name":"John"}'

const obj = transform.json.untransform(json)
console.log(obj) // { name: 'John' }
```

### Base64 кодирование

```typescript
const encoded = transform.base64.transform('Hello World')
console.log(encoded) // 'SGVsbG8gV29ybGQ='

const decoded = transform.base64.untransform(encoded)
console.log(decoded) // 'Hello World'
```

### Пользовательская трансформация

```typescript
defineTransform('uppercase',
  (value: string) => value.toUpperCase(),
  (value: string) => value.toLowerCase()
)

const upper = transform.uppercase.transform('hello')
console.log(upper) // 'HELLO'

const lower = transform.uppercase.untransform(upper)
console.log(lower) // 'hello'
```
