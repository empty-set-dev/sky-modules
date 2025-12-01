# Type Guards

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  type-guards utility module
</div>

TypeScript type guard functions and assertion utilities for runtime type checking.

## Overview

Type guards provide runtime type checking with TypeScript type narrowing support. Each type has both a guard function (returns boolean) and an assertion function (throws on mismatch).

**Key Features:**
- Type guards for all JavaScript primitives
- Type assertion functions
- Full TypeScript type narrowing
- Template string array guards
- Nullish checks
- Zero dependencies

## Installation

```typescript
import {
  isString,
  isNumber,
  isBoolean,
  // ... other guards
} from '@sky-modules/core/type-guards'
```

## Type Guards

Type guards return `true/false` and narrow TypeScript types.

### Primitives

#### `isUndefined(value)`

Check if value is undefined.

```typescript
isUndefined(value: unknown): value is undefined
```

**Example:**
```typescript
const value: unknown = undefined

if (isUndefined(value)) {
  // value is undefined here
  console.log('Value is undefined')
}
```

#### `isNull(value)`

Check if value is null.

```typescript
isNull(value: unknown): value is null
```

**Example:**
```typescript
const value: unknown = null

if (isNull(value)) {
  // value is null here
  console.log('Value is null')
}
```

#### `isNullish(value)`

Check if value is null or undefined.

```typescript
isNullish(value: unknown): value is null | undefined
```

**Example:**
```typescript
const value: unknown = getUserData()

if (isNullish(value)) {
  // value is null | undefined here
  return 'No data'
}

// value is not null or undefined here
processData(value)
```

#### `isBoolean(value)`

Check if value is boolean.

```typescript
isBoolean(value: unknown): value is boolean
```

**Example:**
```typescript
const value: unknown = true

if (isBoolean(value)) {
  // value is boolean here
  console.log(value ? 'yes' : 'no')
}
```

#### `isNumber(value)`

Check if value is number.

```typescript
isNumber(value: unknown): value is number
```

**Example:**
```typescript
const value: unknown = 42

if (isNumber(value)) {
  // value is number here
  const doubled = value * 2
}
```

#### `isBigInt(value)`

Check if value is bigint.

```typescript
isBigInt(value: unknown): value is bigint
```

**Example:**
```typescript
const value: unknown = 9007199254740991n

if (isBigInt(value)) {
  // value is bigint here
  const larger = value + 1n
}
```

#### `isSymbol(value)`

Check if value is symbol.

```typescript
isSymbol(value: unknown): value is symbol
```

**Example:**
```typescript
const value: unknown = Symbol('key')

if (isSymbol(value)) {
  // value is symbol here
  const description = value.description
}
```

#### `isString(value)`

Check if value is string.

```typescript
isString(value: unknown): value is string
```

**Example:**
```typescript
const value: unknown = 'hello'

if (isString(value)) {
  // value is string here
  const upper = value.toUpperCase()
}
```

### Objects & Arrays

#### `isArray(value)`

Check if value is array.

```typescript
isArray(value: unknown): value is unknown[]
```

**Example:**
```typescript
const value: unknown = [1, 2, 3]

if (isArray(value)) {
  // value is unknown[] here
  const length = value.length
  value.forEach(item => console.log(item))
}
```

#### `isObject(value)`

Check if value is plain object (not array, not null).

```typescript
isObject(value: unknown): value is object
```

**Example:**
```typescript
const value: unknown = { name: 'John' }

if (isObject(value)) {
  // value is object here (not array, not null)
  const keys = Object.keys(value)
}
```

**Note:** Excludes arrays and null (unlike `typeof value === 'object'`).

#### `isFunction(value)`

Check if value is function.

```typescript
isFunction(value: unknown): value is Function
```

**Example:**
```typescript
const value: unknown = () => {}

if (isFunction(value)) {
  // value is Function here
  value()
}
```

### Special Types

#### `isTemplateStringsArray(value)`

Check if value is TemplateStringsArray (for tagged templates).

```typescript
isTemplateStringsArray(value: unknown): value is TemplateStringsArray
```

**Example:**
```typescript
function tag(strings: TemplateStringsArray, ...values: unknown[]) {
  // ...
}

function genericTag(strings: unknown, ...values: unknown[]) {
  if (isTemplateStringsArray(strings)) {
    // strings is TemplateStringsArray here
    return tag(strings, ...values)
  }
}
```

## Type Assertions

Assertion functions throw errors if type doesn't match. Use for validation.

### Primitives

#### `asUndefined(value)`

Assert value is undefined.

```typescript
asUndefined(value: unknown): asserts value is undefined
```

**Example:**
```typescript
function requireUndefined(value: unknown) {
  asUndefined(value)
  // value is undefined here (or error thrown)
}
```

#### `asNull(value)`

Assert value is null.

```typescript
asNull(value: unknown): asserts value is null
```

#### `asNullish(value)`

Assert value is null or undefined.

```typescript
asNullish(value: unknown): asserts value is undefined | null
```

#### `asBoolean(value)`

Assert value is boolean.

```typescript
asBoolean(value: unknown): asserts value is boolean
```

**Example:**
```typescript
function processBooleanFlag(value: unknown) {
  asBoolean(value)
  // value is boolean here (or error thrown)

  if (value) {
    // ...
  }
}
```

#### `asNumber(value)`

Assert value is number.

```typescript
asNumber(value: unknown): asserts value is number
```

**Example:**
```typescript
function processNumber(value: unknown) {
  asNumber(value)
  // value is number here (or error thrown)

  return value * 2
}
```

#### `asBigInt(value)`

Assert value is bigint.

```typescript
asBigInt(value: unknown): asserts value is bigint
```

#### `asSymbol(value)`

Assert value is symbol.

```typescript
asSymbol(value: unknown): asserts value is symbol
```

#### `asString(value)`

Assert value is string.

```typescript
asString(value: unknown): asserts value is string
```

**Example:**
```typescript
function processString(value: unknown) {
  asString(value)
  // value is string here (or error thrown)

  return value.toUpperCase()
}
```

### Objects & Arrays

#### `asArray(value)`

Assert value is array.

```typescript
asArray(value: unknown): asserts value is unknown[]
```

**Example:**
```typescript
function processArray(value: unknown) {
  asArray(value)
  // value is unknown[] here (or error thrown)

  return value.map(item => processItem(item))
}
```

#### `asObject(value)`

Assert value is object (not array, not null).

```typescript
asObject(value: unknown): asserts value is object
```

**Example:**
```typescript
function processObject(value: unknown) {
  asObject(value)
  // value is object here (or error thrown)

  const keys = Object.keys(value)
}
```

#### `asFunction(value)`

Assert value is function.

```typescript
asFunction(value: unknown): asserts value is Function
```

**Example:**
```typescript
function executeCallback(callback: unknown) {
  asFunction(callback)
  // callback is Function here (or error thrown)

  callback()
}
```

### Special Types

#### `asTemplateStringsArray(value)`

Assert value is TemplateStringsArray.

```typescript
asTemplateStringsArray(value: unknown): asserts value is TemplateStringsArray
```

## Usage Patterns

### Input Validation

```typescript
function processUserInput(input: unknown) {
  // Validate input type
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  // input is string here
  return input.trim()
}
```

### API Response Validation

```typescript
interface User {
  id: number
  name: string
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data: unknown = await response.json()

  // Validate response shape
  if (!isObject(data)) {
    throw new Error('Invalid response: not an object')
  }

  if (!('id' in data && isNumber(data.id))) {
    throw new Error('Invalid response: missing id')
  }

  if (!('name' in data && isString(data.name))) {
    throw new Error('Invalid response: missing name')
  }

  return data as User
}
```

### Type Narrowing

```typescript
function processValue(value: string | number | boolean) {
  if (isString(value)) {
    // value is string
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    // value is number
    console.log(value.toFixed(2))
  } else {
    // value is boolean
    console.log(value ? 'yes' : 'no')
  }
}
```

### Assertion in Functions

```typescript
function sum(a: unknown, b: unknown): number {
  asNumber(a)
  asNumber(b)

  // Both a and b are numbers here
  return a + b
}

try {
  sum(10, 20)  // OK
  sum('10', 20)  // Throws error
} catch (error) {
  console.error('Invalid input:', error.message)
}
```

### Array Element Validation

```typescript
function processStringArray(arr: unknown): string[] {
  asArray(arr)

  // Validate each element
  for (const item of arr) {
    asString(item)
  }

  // arr is string[] here (TypeScript doesn't infer this automatically)
  return arr as string[]
}
```

### Optional Values

```typescript
function getOptionalValue(data: unknown): string | undefined {
  if (isNullish(data)) {
    return undefined
  }

  asString(data)
  return data
}
```

### Function Parameters

```typescript
function addEventListener(
  event: unknown,
  handler: unknown
): void {
  asString(event)
  asFunction(handler)

  // Both are validated
  window.addEventListener(event, handler)
}
```

## Best Practices

### 1. Use Guards for Branching

```typescript
// Good - type guard
if (isString(value)) {
  return value.toUpperCase()
}

// Avoid - manual checking without narrowing
if (typeof value === 'string') {
  return (value as string).toUpperCase()
}
```

### 2. Use Assertions for Validation

```typescript
// Good - assertion for validation
function process(input: unknown) {
  asString(input)
  return input.trim()
}

// Avoid - manual validation without narrowing
function process(input: unknown) {
  if (typeof input !== 'string') {
    throw new Error('not a string')
  }
  return (input as string).trim()
}
```

### 3. Combine Guards

```typescript
function processData(data: unknown) {
  if (isObject(data) && 'name' in data && isString(data.name)) {
    // Safe to access data.name
    console.log(data.name.toUpperCase())
  }
}
```

### 4. Error Messages

```typescript
// Assertions throw generic errors
try {
  asString(value)
} catch (error) {
  // error.message === 'not a string'
}

// Add context for better errors
function validateName(value: unknown): string {
  try {
    asString(value)
    return value
  } catch {
    throw new Error(`Invalid name: expected string, got ${typeof value}`)
  }
}
```

## Related Modules

- [core/EventEmitter](../EventEmitter/) - Event-driven programming
- [core/PromisePool](../PromisePool/) - Concurrent promise execution
- [core/assume](../assume/) - Type assumption utilities

## Examples

See [type-guards.spec.ts](./type-guards.spec.ts) for comprehensive test cases and usage examples.
