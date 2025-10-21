# Type Guards (Проверки типов)

Утилиты для типобезопасной проверки типов во время выполнения в TypeScript.

## Обзор

Модуль type guards предоставляет коллекцию функций для проверки типов во время выполнения, которые бесшовно работают с системой типов TypeScript. Каждая функция существует в двух вариантах:
- **`is*`** - Возвращает boolean, сужает тип в if выражениях
- **`as*`** - Бросает ошибку если тип не совпадает, утверждает тип

## Быстрый старт

```typescript
import {
    isString,
    asString,
    isNumber,
    isArray,
    isObject,
} from '@sky-modules/core/type-guards'

// Type guard - сужает тип
function processValue(value: unknown) {
    if (isString(value)) {
        // TypeScript знает что value это string
        console.log(value.toUpperCase())
    }
}

// Assertion - бросает ошибку если не string
function requireString(value: unknown): string {
    asString(value) // Бросает ошибку если не string
    return value // TypeScript знает что это string
}
```

## Справочник API

### Undefined

**`isUndefined(value: unknown): value is undefined`**

Проверяет является ли значение `undefined`.

```typescript
isUndefined(undefined) // true
isUndefined(null) // false
isUndefined(0) // false
```

**`asUndefined(value: unknown): asserts value is undefined`**

Утверждает что значение `undefined`, иначе бросает ошибку.

```typescript
asUndefined(undefined) // OK
asUndefined(null) // Ошибка: "not an undefined"
```

### Null

**`isNull(value: unknown): value is null`**

Проверяет является ли значение `null`.

```typescript
isNull(null) // true
isNull(undefined) // false
isNull(0) // false
```

**`asNull(value: unknown): asserts value is null`**

Утверждает что значение `null`, иначе бросает ошибку.

```typescript
asNull(null) // OK
asNull(undefined) // Ошибка: "not a null"
```

### Nullish

**`isNullish(value: unknown): value is null | undefined`**

Проверяет является ли значение `null` или `undefined`.

```typescript
isNullish(null) // true
isNullish(undefined) // true
isNullish(0) // false
isNullish('') // false
```

**`asNullish(value: unknown): asserts value is null | undefined`**

Утверждает что значение `null` или `undefined`, иначе бросает ошибку.

```typescript
asNullish(null) // OK
asNullish(undefined) // OK
asNullish(0) // Ошибка: "not a nullish"
```

### Boolean

**`isBoolean(value: unknown): value is boolean`**

Проверяет является ли значение boolean.

```typescript
isBoolean(true) // true
isBoolean(false) // true
isBoolean(1) // false
isBoolean('true') // false
```

**`asBoolean(value: unknown): asserts value is boolean`**

Утверждает что значение boolean, иначе бросает ошибку.

```typescript
asBoolean(true) // OK
asBoolean(1) // Ошибка: "not a boolean"
```

### Number

**`isNumber(value: unknown): value is number`**

Проверяет является ли значение числом (включая `NaN` и `Infinity`).

```typescript
isNumber(42) // true
isNumber(-1.5) // true
isNumber(NaN) // true
isNumber(Infinity) // true
isNumber('42') // false
```

**`asNumber(value: unknown): asserts value is number`**

Утверждает что значение число, иначе бросает ошибку.

```typescript
asNumber(42) // OK
asNumber('42') // Ошибка: "not a number"
```

### BigInt

**`isBigInt(value: unknown): value is bigint`**

Проверяет является ли значение bigint.

```typescript
isBigInt(42n) // true
isBigInt(42) // false
isBigInt('42n') // false
```

**`asBigInt(value: unknown): asserts value is bigint`**

Утверждает что значение bigint, иначе бросает ошибку.

```typescript
asBigInt(42n) // OK
asBigInt(42) // Ошибка: "not a bigint"
```

### Symbol

**`isSymbol(value: unknown): value is symbol`**

Проверяет является ли значение symbol.

```typescript
isSymbol(Symbol()) // true
isSymbol(Symbol('test')) // true
isSymbol('symbol') // false
```

**`asSymbol(value: unknown): asserts value is symbol`**

Утверждает что значение symbol, иначе бросает ошибку.

```typescript
asSymbol(Symbol()) // OK
asSymbol('symbol') // Ошибка: "not a symbol"
```

### String

**`isString(value: unknown): value is string`**

Проверяет является ли значение строкой.

```typescript
isString('привет') // true
isString('') // true
isString(42) // false
```

**`asString(value: unknown): asserts value is string`**

Утверждает что значение строка, иначе бросает ошибку.

```typescript
asString('привет') // OK
asString(42) // Ошибка: "not a string"
```

### Template Strings Array

**`isTemplateStringsArray(value: unknown): value is TemplateStringsArray`**

Проверяет является ли значение массивом шаблонных строк (из tagged template literals).

```typescript
function tag(strings: TemplateStringsArray, ...values: any[]) {
    isTemplateStringsArray(strings) // true
}

tag`Привет ${name}`

isTemplateStringsArray(['a', 'b']) // false
```

**`asTemplateStringsArray(value: unknown): asserts value is TemplateStringsArray`**

Утверждает что значение массив шаблонных строк, иначе бросает ошибку.

### Array

**`isArray(value: unknown): value is unknown[]`**

Проверяет является ли значение массивом.

```typescript
isArray([]) // true
isArray([1, 2, 3]) // true
isArray('array') // false
isArray({ length: 0 }) // false
```

**`asArray(value: unknown): asserts value is unknown[]`**

Утверждает что значение массив, иначе бросает ошибку.

```typescript
asArray([1, 2, 3]) // OK
asArray('array') // Ошибка: "not an array"
```

### Object

**`isObject(value: unknown): value is object`**

Проверяет является ли значение объектом (исключая массивы и null).

```typescript
isObject({}) // true
isObject({ a: 1 }) // true
isObject(new Date()) // true
isObject([]) // false
isObject(null) // false
```

**`asObject(value: unknown): asserts value is object`**

Утверждает что значение объект, иначе бросает ошибку.

```typescript
asObject({ a: 1 }) // OK
asObject([]) // Ошибка: "not an object"
asObject(null) // Ошибка: "not an object"
```

### Function

**`isFunction(value: unknown): value is Function`**

Проверяет является ли значение функцией.

```typescript
isFunction(() => {}) // true
isFunction(function () {}) // true
isFunction(class {}) // true
isFunction({}) // false
```

**`asFunction(value: unknown): asserts value is Function`**

Утверждает что значение функция, иначе бросает ошибку.

```typescript
asFunction(() => {}) // OK
asFunction('function') // Ошибка: "not a function"
```

## Паттерны использования

### Сужение типов

Используйте `is*` функции в условиях для сужения типов:

```typescript
function processValue(value: unknown) {
    if (isString(value)) {
        // TypeScript знает что value это string
        return value.toUpperCase()
    }

    if (isNumber(value)) {
        // TypeScript знает что value это number
        return value.toFixed(2)
    }

    if (isArray(value)) {
        // TypeScript знает что value это array
        return value.length
    }
}
```

### Защитное программирование

Используйте `as*` функции для валидации входных данных:

```typescript
function processUser(data: unknown) {
    asObject(data)

    const name = data.name
    asString(name)

    const age = data.age
    asNumber(age)

    // Теперь TypeScript знает типы
    return { name, age }
}
```

### Ранние возвраты

Комбинируйте с ранними возвратами для чистого кода:

```typescript
function formatValue(value: unknown): string {
    if (!isString(value) && !isNumber(value)) {
        throw new Error('Значение должно быть string или number')
    }

    // TypeScript знает что value это string | number
    return String(value)
}
```

### Проверки на Nullish

Элегантно обрабатывайте null/undefined:

```typescript
function getLength(value: unknown): number {
    if (isNullish(value)) {
        return 0
    }

    if (isString(value) || isArray(value)) {
        return value.length
    }

    return 1
}
```

### Кастомные Type Guards

Создавайте guards высокого уровня:

```typescript
interface User {
    name: string
    age: number
}

function isUser(value: unknown): value is User {
    if (!isObject(value)) return false

    const obj = value as Record<string, unknown>
    return isString(obj.name) && isNumber(obj.age)
}
```

## Лучшие практики

### 1. Предпочитайте `is*` для управления потоком

Используйте type guards для ветвления логики:

```typescript
// ✅ Хорошо
if (isString(value)) {
    console.log(value.toUpperCase())
}

// ❌ Плохо
asString(value)
console.log(value.toUpperCase())
```

### 2. Используйте `as*` для валидации

Используйте assertions когда ожидаете конкретный тип:

```typescript
// ✅ Хорошо - валидирует ответ API
function parseUser(json: unknown) {
    asObject(json)
    asString(json.name)
    asNumber(json.age)
    return { name: json.name, age: json.age }
}

// ❌ Плохо - игнорирует валидацию
function parseUser(json: any) {
    return { name: json.name, age: json.age }
}
```

### 3. Проверяйте перед доступом к Array/Object

Всегда валидируйте перед доступом к свойствам:

```typescript
// ✅ Хорошо
function getFirstItem(value: unknown) {
    if (!isArray(value) || value.length === 0) {
        return null
    }
    return value[0]
}

// ❌ Плохо - runtime ошибка если не массив
function getFirstItem(value: any) {
    return value[0]
}
```

### 4. Комбинируйте Guards для сложных типов

Объединяйте guards для сложной валидации:

```typescript
function processData(value: unknown) {
    if (!isObject(value)) return null

    const obj = value as Record<string, unknown>

    if (!isArray(obj.items)) return null
    if (!isString(obj.name)) return null

    // Теперь мы знаем структуру
    return { name: obj.name, items: obj.items }
}
```

## Интеграция с TypeScript

Эти guards бесшовно работают с анализом потока управления TypeScript:

```typescript
function example(value: unknown) {
    // value это unknown

    if (isString(value)) {
        // value это string
        value.toUpperCase()
    }

    // value это unknown (string был сужен в if блоке)

    asNumber(value)
    // value это number (assertion сужает тип)
    value.toFixed(2)
}
```

## Сообщения об ошибках

Все `as*` функции бросают описательные ошибки:

```typescript
asString(42) // Error: "not a string"
asArray({}) // Error: "not an array"
asObject(null) // Error: "not an object"
```

## Производительность

Все guards - это простые `typeof` проверки или `Array.isArray()` - крайне быстрые и легковесные. Нет накладных расходов на проверку типов во время выполнения.

## Смотрите также

- [модуль not](../not/not.ru.md) - Утилиты высокого уровня для null/undefined
- [define система](../define/README.md) - Регистрация классов во время выполнения
