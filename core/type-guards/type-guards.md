# Type Guards

Type-safe runtime type checking utilities for TypeScript.

## Overview

The type guards module provides a collection of runtime type checking functions that work seamlessly with TypeScript's type system. Each function comes in two variants:
- **`is*`** - Returns boolean, narrows type in if statements
- **`as*`** - Throws error if type doesn't match, asserts type

## Quick Start

```typescript
import {
    isString,
    asString,
    isNumber,
    isArray,
    isObject,
} from '@sky-modules/core/type-guards'

// Type guard - narrows type
function processValue(value: unknown) {
    if (isString(value)) {
        // TypeScript knows value is string here
        console.log(value.toUpperCase())
    }
}

// Assertion - throws if not a string
function requireString(value: unknown): string {
    asString(value) // Throws if not string
    return value // TypeScript knows it's string
}
```

## API Reference

### Undefined

**`isUndefined(value: unknown): value is undefined`**

Checks if value is `undefined`.

```typescript
isUndefined(undefined) // true
isUndefined(null) // false
isUndefined(0) // false
```

**`asUndefined(value: unknown): asserts value is undefined`**

Asserts that value is `undefined`, throws otherwise.

```typescript
asUndefined(undefined) // OK
asUndefined(null) // Throws: "not an undefined"
```

### Null

**`isNull(value: unknown): value is null`**

Checks if value is `null`.

```typescript
isNull(null) // true
isNull(undefined) // false
isNull(0) // false
```

**`asNull(value: unknown): asserts value is null`**

Asserts that value is `null`, throws otherwise.

```typescript
asNull(null) // OK
asNull(undefined) // Throws: "not a null"
```

### Nullish

**`isNullish(value: unknown): value is null | undefined`**

Checks if value is `null` or `undefined`.

```typescript
isNullish(null) // true
isNullish(undefined) // true
isNullish(0) // false
isNullish('') // false
```

**`asNullish(value: unknown): asserts value is null | undefined`**

Asserts that value is `null` or `undefined`, throws otherwise.

```typescript
asNullish(null) // OK
asNullish(undefined) // OK
asNullish(0) // Throws: "not a nullish"
```

### Boolean

**`isBoolean(value: unknown): value is boolean`**

Checks if value is a boolean.

```typescript
isBoolean(true) // true
isBoolean(false) // true
isBoolean(1) // false
isBoolean('true') // false
```

**`asBoolean(value: unknown): asserts value is boolean`**

Asserts that value is a boolean, throws otherwise.

```typescript
asBoolean(true) // OK
asBoolean(1) // Throws: "not a boolean"
```

### Number

**`isNumber(value: unknown): value is number`**

Checks if value is a number (including `NaN` and `Infinity`).

```typescript
isNumber(42) // true
isNumber(-1.5) // true
isNumber(NaN) // true
isNumber(Infinity) // true
isNumber('42') // false
```

**`asNumber(value: unknown): asserts value is number`**

Asserts that value is a number, throws otherwise.

```typescript
asNumber(42) // OK
asNumber('42') // Throws: "not a number"
```

### BigInt

**`isBigInt(value: unknown): value is bigint`**

Checks if value is a bigint.

```typescript
isBigInt(42n) // true
isBigInt(42) // false
isBigInt('42n') // false
```

**`asBigInt(value: unknown): asserts value is bigint`**

Asserts that value is a bigint, throws otherwise.

```typescript
asBigInt(42n) // OK
asBigInt(42) // Throws: "not a bigint"
```

### Symbol

**`isSymbol(value: unknown): value is symbol`**

Checks if value is a symbol.

```typescript
isSymbol(Symbol()) // true
isSymbol(Symbol('test')) // true
isSymbol('symbol') // false
```

**`asSymbol(value: unknown): asserts value is symbol`**

Asserts that value is a symbol, throws otherwise.

```typescript
asSymbol(Symbol()) // OK
asSymbol('symbol') // Throws: "not a symbol"
```

### String

**`isString(value: unknown): value is string`**

Checks if value is a string.

```typescript
isString('hello') // true
isString('') // true
isString(42) // false
```

**`asString(value: unknown): asserts value is string`**

Asserts that value is a string, throws otherwise.

```typescript
asString('hello') // OK
asString(42) // Throws: "not a string"
```

### Template Strings Array

**`isTemplateStringsArray(value: unknown): value is TemplateStringsArray`**

Checks if value is a template strings array (from tagged template literals).

```typescript
function tag(strings: TemplateStringsArray, ...values: any[]) {
    isTemplateStringsArray(strings) // true
}

tag`Hello ${name}`

isTemplateStringsArray(['a', 'b']) // false
```

**`asTemplateStringsArray(value: unknown): asserts value is TemplateStringsArray`**

Asserts that value is a template strings array, throws otherwise.

### Array

**`isArray(value: unknown): value is unknown[]`**

Checks if value is an array.

```typescript
isArray([]) // true
isArray([1, 2, 3]) // true
isArray('array') // false
isArray({ length: 0 }) // false
```

**`asArray(value: unknown): asserts value is unknown[]`**

Asserts that value is an array, throws otherwise.

```typescript
asArray([1, 2, 3]) // OK
asArray('array') // Throws: "not an array"
```

### Object

**`isObject(value: unknown): value is object`**

Checks if value is an object (excludes arrays and null).

```typescript
isObject({}) // true
isObject({ a: 1 }) // true
isObject(new Date()) // true
isObject([]) // false
isObject(null) // false
```

**`asObject(value: unknown): asserts value is object`**

Asserts that value is an object, throws otherwise.

```typescript
asObject({ a: 1 }) // OK
asObject([]) // Throws: "not an object"
asObject(null) // Throws: "not an object"
```

### Function

**`isFunction(value: unknown): value is Function`**

Checks if value is a function.

```typescript
isFunction(() => {}) // true
isFunction(function () {}) // true
isFunction(class {}) // true
isFunction({}) // false
```

**`asFunction(value: unknown): asserts value is Function`**

Asserts that value is a function, throws otherwise.

```typescript
asFunction(() => {}) // OK
asFunction('function') // Throws: "not a function"
```

## Usage Patterns

### Type Narrowing

Use `is*` functions in conditionals to narrow types:

```typescript
function processValue(value: unknown) {
    if (isString(value)) {
        // TypeScript knows value is string
        return value.toUpperCase()
    }

    if (isNumber(value)) {
        // TypeScript knows value is number
        return value.toFixed(2)
    }

    if (isArray(value)) {
        // TypeScript knows value is array
        return value.length
    }
}
```

### Defensive Programming

Use `as*` functions to validate input:

```typescript
function processUser(data: unknown) {
    asObject(data)

    const name = data.name
    asString(name)

    const age = data.age
    asNumber(age)

    // Now TypeScript knows the types
    return { name, age }
}
```

### Early Returns

Combine with early returns for clean code:

```typescript
function formatValue(value: unknown): string {
    if (!isString(value) && !isNumber(value)) {
        throw new Error('Value must be string or number')
    }

    // TypeScript knows value is string | number
    return String(value)
}
```

### Nullish Checks

Handle null/undefined elegantly:

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

### Custom Type Guards

Build higher-level guards:

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

## Best Practices

### 1. Prefer `is*` for Flow Control

Use type guards for branching logic:

```typescript
// ✅ Good
if (isString(value)) {
    console.log(value.toUpperCase())
}

// ❌ Bad
asString(value)
console.log(value.toUpperCase())
```

### 2. Use `as*` for Validation

Use assertions when you expect a specific type:

```typescript
// ✅ Good - validates API response
function parseUser(json: unknown) {
    asObject(json)
    asString(json.name)
    asNumber(json.age)
    return { name: json.name, age: json.age }
}

// ❌ Bad - ignores validation
function parseUser(json: any) {
    return { name: json.name, age: json.age }
}
```

### 3. Check Before Array/Object Access

Always validate before accessing properties:

```typescript
// ✅ Good
function getFirstItem(value: unknown) {
    if (!isArray(value) || value.length === 0) {
        return null
    }
    return value[0]
}

// ❌ Bad - runtime error if not array
function getFirstItem(value: any) {
    return value[0]
}
```

### 4. Combine Guards for Complex Types

Chain guards for complex validation:

```typescript
function processData(value: unknown) {
    if (!isObject(value)) return null

    const obj = value as Record<string, unknown>

    if (!isArray(obj.items)) return null
    if (!isString(obj.name)) return null

    // Now we know the structure
    return { name: obj.name, items: obj.items }
}
```

## TypeScript Integration

These guards work seamlessly with TypeScript's control flow analysis:

```typescript
function example(value: unknown) {
    // value is unknown

    if (isString(value)) {
        // value is string
        value.toUpperCase()
    }

    // value is unknown (string was narrowed in if block)

    asNumber(value)
    // value is number (assertion narrows type)
    value.toFixed(2)
}
```

## Error Messages

All `as*` functions throw descriptive errors:

```typescript
asString(42) // Error: "not a string"
asArray({}) // Error: "not an array"
asObject(null) // Error: "not an object"
```

## Performance

All guards are simple `typeof` checks or `Array.isArray()` - extremely fast and lightweight. No overhead for runtime type checking.

## See Also

- [not module](../not/not.md) - Higher-level null/undefined utilities
- [define system](../define/README.md) - Runtime class registration
