# Защитники Типов (Type Guards)

Функции защиты типов и утилиты для проверки типов во время выполнения в TypeScript.

## Обзор

Защитники типов обеспечивают проверку типов во время выполнения с поддержкой сужения типов TypeScript. Каждый тип имеет как функцию-защитник (возвращает boolean), так и функцию-утверждение (выбрасывает исключение при несовпадении).

**Ключевые возможности:**
- Защитники типов для всех JavaScript примитивов
- Функции утверждения типов
- Полное сужение типов TypeScript
- Защитники массивов шаблонных строк
- Проверки на nullish
- Нулевые зависимости

## Установка

```typescript
import {
  isString,
  isNumber,
  isBoolean,
  // ... другие защитники
} from '@sky-modules/core/type-guards'
```

## Защитники Типов

Защитники типов возвращают `true/false` и сужают типы TypeScript.

### Примитивы

#### `isUndefined(value)`

Проверяет, является ли значение undefined.

```typescript
isUndefined(value: unknown): value is undefined
```

**Пример:**
```typescript
const value: unknown = undefined

if (isUndefined(value)) {
  // value является undefined здесь
  console.log('Значение undefined')
}
```

#### `isNull(value)`

Проверяет, является ли значение null.

```typescript
isNull(value: unknown): value is null
```

**Пример:**
```typescript
const value: unknown = null

if (isNull(value)) {
  // value является null здесь
  console.log('Значение null')
}
```

#### `isNullish(value)`

Проверяет, является ли значение null или undefined.

```typescript
isNullish(value: unknown): value is null | undefined
```

**Пример:**
```typescript
const value: unknown = getUserData()

if (isNullish(value)) {
  // value является null | undefined здесь
  return 'Нет данных'
}

// value не null и не undefined здесь
processData(value)
```

#### `isBoolean(value)`

Проверяет, является ли значение boolean.

```typescript
isBoolean(value: unknown): value is boolean
```

**Пример:**
```typescript
const value: unknown = true

if (isBoolean(value)) {
  // value является boolean здесь
  console.log(value ? 'да' : 'нет')
}
```

#### `isNumber(value)`

Проверяет, является ли значение number.

```typescript
isNumber(value: unknown): value is number
```

**Пример:**
```typescript
const value: unknown = 42

if (isNumber(value)) {
  // value является number здесь
  const doubled = value * 2
}
```

#### `isBigInt(value)`

Проверяет, является ли значение bigint.

```typescript
isBigInt(value: unknown): value is bigint
```

**Пример:**
```typescript
const value: unknown = 9007199254740991n

if (isBigInt(value)) {
  // value является bigint здесь
  const larger = value + 1n
}
```

#### `isSymbol(value)`

Проверяет, является ли значение symbol.

```typescript
isSymbol(value: unknown): value is symbol
```

**Пример:**
```typescript
const value: unknown = Symbol('ключ')

if (isSymbol(value)) {
  // value является symbol здесь
  const description = value.description
}
```

#### `isString(value)`

Проверяет, является ли значение string.

```typescript
isString(value: unknown): value is string
```

**Пример:**
```typescript
const value: unknown = 'привет'

if (isString(value)) {
  // value является string здесь
  const upper = value.toUpperCase()
}
```

### Объекты и Массивы

#### `isArray(value)`

Проверяет, является ли значение массивом.

```typescript
isArray(value: unknown): value is unknown[]
```

**Пример:**
```typescript
const value: unknown = [1, 2, 3]

if (isArray(value)) {
  // value является unknown[] здесь
  const length = value.length
  value.forEach(item => console.log(item))
}
```

#### `isObject(value)`

Проверяет, является ли значение простым объектом (не массив, не null).

```typescript
isObject(value: unknown): value is object
```

**Пример:**
```typescript
const value: unknown = { name: 'Иван' }

if (isObject(value)) {
  // value является object здесь (не массив, не null)
  const keys = Object.keys(value)
}
```

**Примечание:** Исключает массивы и null (в отличие от `typeof value === 'object'`).

#### `isFunction(value)`

Проверяет, является ли значение функцией.

```typescript
isFunction(value: unknown): value is Function
```

**Пример:**
```typescript
const value: unknown = () => {}

if (isFunction(value)) {
  // value является Function здесь
  value()
}
```

### Специальные Типы

#### `isTemplateStringsArray(value)`

Проверяет, является ли значение TemplateStringsArray (для тегированных шаблонов).

```typescript
isTemplateStringsArray(value: unknown): value is TemplateStringsArray
```

**Пример:**
```typescript
function tag(strings: TemplateStringsArray, ...values: unknown[]) {
  // ...
}

function genericTag(strings: unknown, ...values: unknown[]) {
  if (isTemplateStringsArray(strings)) {
    // strings является TemplateStringsArray здесь
    return tag(strings, ...values)
  }
}
```

## Утверждения Типов

Функции утверждения выбрасывают ошибки, если тип не совпадает. Используются для валидации.

### Примитивы

#### `asUndefined(value)`

Утверждает, что значение является undefined.

```typescript
asUndefined(value: unknown): asserts value is undefined
```

**Пример:**
```typescript
function requireUndefined(value: unknown) {
  asUndefined(value)
  // value является undefined здесь (или выброшена ошибка)
}
```

#### `asNull(value)`

Утверждает, что значение является null.

```typescript
asNull(value: unknown): asserts value is null
```

#### `asNullish(value)`

Утверждает, что значение является null или undefined.

```typescript
asNullish(value: unknown): asserts value is undefined | null
```

#### `asBoolean(value)`

Утверждает, что значение является boolean.

```typescript
asBoolean(value: unknown): asserts value is boolean
```

**Пример:**
```typescript
function processBooleanFlag(value: unknown) {
  asBoolean(value)
  // value является boolean здесь (или выброшена ошибка)

  if (value) {
    // ...
  }
}
```

#### `asNumber(value)`

Утверждает, что значение является number.

```typescript
asNumber(value: unknown): asserts value is number
```

**Пример:**
```typescript
function processNumber(value: unknown) {
  asNumber(value)
  // value является number здесь (или выброшена ошибка)

  return value * 2
}
```

#### `asBigInt(value)`

Утверждает, что значение является bigint.

```typescript
asBigInt(value: unknown): asserts value is bigint
```

#### `asSymbol(value)`

Утверждает, что значение является symbol.

```typescript
asSymbol(value: unknown): asserts value is symbol
```

#### `asString(value)`

Утверждает, что значение является string.

```typescript
asString(value: unknown): asserts value is string
```

**Пример:**
```typescript
function processString(value: unknown) {
  asString(value)
  // value является string здесь (или выброшена ошибка)

  return value.toUpperCase()
}
```

### Объекты и Массивы

#### `asArray(value)`

Утверждает, что значение является массивом.

```typescript
asArray(value: unknown): asserts value is unknown[]
```

**Пример:**
```typescript
function processArray(value: unknown) {
  asArray(value)
  // value является unknown[] здесь (или выброшена ошибка)

  return value.map(item => processItem(item))
}
```

#### `asObject(value)`

Утверждает, что значение является объектом (не массив, не null).

```typescript
asObject(value: unknown): asserts value is object
```

**Пример:**
```typescript
function processObject(value: unknown) {
  asObject(value)
  // value является object здесь (или выброшена ошибка)

  const keys = Object.keys(value)
}
```

#### `asFunction(value)`

Утверждает, что значение является функцией.

```typescript
asFunction(value: unknown): asserts value is Function
```

**Пример:**
```typescript
function executeCallback(callback: unknown) {
  asFunction(callback)
  // callback является Function здесь (или выброшена ошибка)

  callback()
}
```

### Специальные Типы

#### `asTemplateStringsArray(value)`

Утверждает, что значение является TemplateStringsArray.

```typescript
asTemplateStringsArray(value: unknown): asserts value is TemplateStringsArray
```

## Паттерны Использования

### Валидация Входных Данных

```typescript
function processUserInput(input: unknown) {
  // Валидация типа входных данных
  if (!isString(input)) {
    throw new Error('Входные данные должны быть строкой')
  }

  // input является string здесь
  return input.trim()
}
```

### Валидация Ответа API

```typescript
interface User {
  id: number
  name: string
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data: unknown = await response.json()

  // Валидация структуры ответа
  if (!isObject(data)) {
    throw new Error('Неверный ответ: не объект')
  }

  if (!('id' in data && isNumber(data.id))) {
    throw new Error('Неверный ответ: отсутствует id')
  }

  if (!('name' in data && isString(data.name))) {
    throw new Error('Неверный ответ: отсутствует name')
  }

  return data as User
}
```

### Сужение Типов

```typescript
function processValue(value: string | number | boolean) {
  if (isString(value)) {
    // value является string
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    // value является number
    console.log(value.toFixed(2))
  } else {
    // value является boolean
    console.log(value ? 'да' : 'нет')
  }
}
```

### Утверждения в Функциях

```typescript
function sum(a: unknown, b: unknown): number {
  asNumber(a)
  asNumber(b)

  // И a, и b являются numbers здесь
  return a + b
}

try {
  sum(10, 20)  // OK
  sum('10', 20)  // Выбрасывает ошибку
} catch (error) {
  console.error('Неверные входные данные:', error.message)
}
```

### Валидация Элементов Массива

```typescript
function processStringArray(arr: unknown): string[] {
  asArray(arr)

  // Валидация каждого элемента
  for (const item of arr) {
    asString(item)
  }

  // arr является string[] здесь (TypeScript не выводит это автоматически)
  return arr as string[]
}
```

### Опциональные Значения

```typescript
function getOptionalValue(data: unknown): string | undefined {
  if (isNullish(data)) {
    return undefined
  }

  asString(data)
  return data
}
```

### Параметры Функций

```typescript
function addEventListener(
  event: unknown,
  handler: unknown
): void {
  asString(event)
  asFunction(handler)

  // Оба провалидированы
  window.addEventListener(event, handler)
}
```

## Лучшие Практики

### 1. Используйте Защитники для Ветвления

```typescript
// Хорошо - защитник типов
if (isString(value)) {
  return value.toUpperCase()
}

// Избегайте - ручная проверка без сужения
if (typeof value === 'string') {
  return (value as string).toUpperCase()
}
```

### 2. Используйте Утверждения для Валидации

```typescript
// Хорошо - утверждение для валидации
function process(input: unknown) {
  asString(input)
  return input.trim()
}

// Избегайте - ручная валидация без сужения
function process(input: unknown) {
  if (typeof input !== 'string') {
    throw new Error('не строка')
  }
  return (input as string).trim()
}
```

### 3. Комбинируйте Защитники

```typescript
function processData(data: unknown) {
  if (isObject(data) && 'name' in data && isString(data.name)) {
    // Безопасный доступ к data.name
    console.log(data.name.toUpperCase())
  }
}
```

### 4. Сообщения об Ошибках

```typescript
// Утверждения выбрасывают общие ошибки
try {
  asString(value)
} catch (error) {
  // error.message === 'not a string'
}

// Добавьте контекст для лучших ошибок
function validateName(value: unknown): string {
  try {
    asString(value)
    return value
  } catch {
    throw new Error(`Неверное имя: ожидалась строка, получено ${typeof value}`)
  }
}
```

## Связанные Модули

- [core/EventEmitter](../EventEmitter/) - Событийно-ориентированное программирование
- [core/PromisePool](../PromisePool/) - Конкурентное выполнение промисов
- [core/assume](../assume/) - Утилиты для предположения типов

## Примеры

См. [type-guards.spec.ts](./type-guards.spec.ts) для полных тестовых кейсов и примеров использования.
