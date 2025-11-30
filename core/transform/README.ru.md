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

### Кодирование данных
- **json** - Преобразование в/из JSON строк (с поддержкой Unicode)
- **base64** - Кодирование/декодирование Base64 строк (с поддержкой Unicode)
- **base64url** - URL-безопасное кодирование Base64 (без символов +/=)
- **hex** - Преобразование в/из шестнадцатеричного представления
- **binary** - Преобразование в/из двоичного представления
- **url** - Кодирование/декодирование URL компонентов

### Манипуляция строками
- **upper** - Преобразование в верхний регистр (необратимо)
- **lower** - Преобразование в нижний регистр (необратимо)
- **reverse** - Переворот символов строки

## Использование

### JSON трансформация

```typescript
const json = transform.json.transform({ name: 'Анна' })
console.log(json) // '{"name":"Анна"}'

const obj = transform.json.untransform(json)
console.log(obj) // { name: 'Анна' }
```

### Base64 кодирование

```typescript
const encoded = transform.base64.transform('Привет мир 🎉')
console.log(encoded) // Base64 закодированная строка

const decoded = transform.base64.untransform(encoded)
console.log(decoded) // 'Привет мир 🎉'
```

### URL кодирование

```typescript
const encoded = transform.url.transform('Привет мир!')
console.log(encoded) // '%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80!'

const decoded = transform.url.untransform(encoded)
console.log(decoded) // 'Привет мир!'
```

### Hex кодирование

```typescript
const hex = transform.hex.transform('Привет')
console.log(hex) // Шестнадцатеричное представление

const text = transform.hex.untransform(hex)
console.log(text) // 'Привет'
```

### Binary кодирование

```typescript
const binary = transform.binary.transform('A')
console.log(binary) // '01000001'

const text = transform.binary.untransform(binary)
console.log(text) // 'A'
```

### URL-безопасный Base64

```typescript
const encoded = transform.base64url.transform('Тестовые данные')
// Без символов +, / или = - безопасно для URL
const decoded = transform.base64url.untransform(encoded)
```

### Преобразование регистра

```typescript
// Примечание: это необратимые трансформации
const upper = to.upper('привет')  // 'ПРИВЕТ'
const lower = to.lower('МИР')  // 'мир'
```

### Переворот строки

```typescript
const reversed = transform.reverse.transform('Привет')
console.log(reversed) // 'тевирП'

const original = transform.reverse.untransform(reversed)
console.log(original) // 'Привет'
```

### Цепочки трансформаций

```typescript
// Цепочка нескольких трансформаций
const result = transform.json.base64.transform({ data: 'тест' })

// Автоматическая отмена в обратном порядке
const original = transform.json.base64.untransform(result)

// Сложные цепочки
const encoded = transform.hex.reverse.base64.transform('данные')
const decoded = transform.hex.reverse.base64.untransform(encoded)
```

### Пользовательская трансформация

```typescript
defineTransform('double',
  (value: number) => value * 2,
  (value: number) => value / 2
)

const result = to.double(5)  // 10
const original = from.double(result)  // 5
```
