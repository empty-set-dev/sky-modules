# not

Типобезопасные утилиты для проверки null/undefined с кастомными типами ошибок.

## Возможности

- Типобезопасные проверки null, undefined и nullish
- Кастомные типы ошибок для лучшей обработки ошибок
- Функции-утверждения для сужения типов
- Поддержка type guards в TypeScript

## API

### Проверки Undefined

#### `notUndefined\<T\>(value: undefined | T, message: string): T`

Возвращает значение, если оно не undefined, иначе выбрасывает `UndefinedError`.

```typescript
const value: string | undefined = getValue()
const result = notUndefined(value, 'Значение должно быть определено')
// result теперь имеет тип string
```

#### `assertIsNotUndefined\<T\>(value: undefined | T, message: string): asserts value is T`

Утверждает, что значение не undefined, используя assertion signatures TypeScript.

```typescript
const value: string | undefined = getValue()
assertIsNotUndefined(value, 'Значение должно быть определено')
// value теперь имеет тип string в оставшейся области видимости
```

#### `UndefinedError`

Кастомный класс ошибки для undefined значений.

### Проверки Null

#### `notNull\<T\>(value: null | T, message: string): T`

Возвращает значение, если оно не null, иначе выбрасывает `NullError`.

```typescript
const value: string | null = getValue()
const result = notNull(value, 'Значение не должно быть null')
// result теперь имеет тип string
```

#### `assertIsNotNull\<T\>(value: null | T, message: string): asserts value is T`

Утверждает, что значение не null, используя assertion signatures TypeScript.

```typescript
const value: string | null = getValue()
assertIsNotNull(value, 'Значение не должно быть null')
// value теперь имеет тип string в оставшейся области видимости
```

#### `NullError`

Кастомный класс ошибки для null значений.

### Проверки Nullish

#### `notNullish\<T\>(value: undefined | null | T, message: string): T`

Возвращает значение, если оно не nullish (null или undefined), иначе выбрасывает `NullishError`.

```typescript
const value: string | null | undefined = getValue()
const result = notNullish(value, 'Значение должно быть определено')
// result теперь имеет тип string
```

#### `assertIsNotNullish\<T\>(value: undefined | null | T, message: string): asserts value is T`

Утверждает, что значение не nullish, используя assertion signatures TypeScript.

```typescript
const value: string | null | undefined = getValue()
assertIsNotNullish(value, 'Значение должно быть определено')
// value теперь имеет тип string в оставшейся области видимости
```

#### `NullishError`

Кастомный класс ошибки для nullish значений.

## Использование

Импортируйте модуль:

```typescript
import '@sky-modules/core/not'
```

Или импортируйте отдельные функции:

```typescript
import { notUndefined, notNull, notNullish } from '@sky-modules/core/not'
```

## Сообщения об ошибках

Все ошибки включают описательные сообщения:

- `UndefinedError`: "unexpected undefined: [ваше сообщение]"
- `NullError`: "unexpected null: [ваше сообщение]"
- `NullishError`: "unexpected nullish: [ваше сообщение]"
