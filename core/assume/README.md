# Assume

Zero-runtime type assertions for TypeScript - tell the compiler to trust you.

## Overview

The assume module provides a type assertion function that performs no runtime checks. It's used to tell TypeScript "trust me, this value is of type T" without any validation. Use with caution!

**Key Features:**
- Type-only assertion (no runtime code)
- Generic type parameter
- Compiles to nothing (zero overhead)
- Dangerous but sometimes necessary

## Installation

```typescript
import assume from '@sky-modules/core/assume'
```

## API Reference

### assume<T>(value)

Assert that a value is of type T (without runtime validation).

```typescript
assume<T>(value: unknown): asserts value is T
```

**Parameters:**
- `value` - Value to assert type for

**Type Effect:** Narrows `value` to type `T`

**Runtime Effect:** None (no-op, compiles to nothing)

**Example:**
```typescript
const data: unknown = JSON.parse(response)

// Tell TypeScript: trust me, this is a User
assume<User>(data)

// Now TypeScript thinks data is User
console.log(data.name) // No type error
console.log(data.email) // No type error
```

## Usage Patterns

### JSON Parsing

```typescript
interface Config {
  apiUrl: string
  timeout: number
}

const rawConfig: unknown = JSON.parse(configString)

// Assume it's Config (dangerous - no validation!)
assume<Config>(rawConfig)

// TypeScript now thinks rawConfig is Config
const url = rawConfig.apiUrl // Type: string
```

### API Responses

```typescript
interface User {
  id: number
  name: string
  email: string
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data: unknown = await response.json()

  // Assume response matches User interface
  assume<User>(data)

  return data // Type: User
}
```

### Type Narrowing

```typescript
function processValue(value: unknown) {
  // Assume it's a string
  assume<string>(value)

  // Now can use string methods
  return value.toUpperCase()
}
```

### Generic Parameters

```typescript
function cast<T>(value: unknown): T {
  assume<T>(value)
  return value
}

const user = cast<User>(rawData)
// user is now typed as User
```

### Working with Any

```typescript
function handleLegacyCode(data: any) {
  // Narrow from any to specific type
  assume<{ id: number, name: string }>(data)

  // Now have specific type
  console.log(data.id, data.name)
}
```

## When to Use

### Safe Uses

```typescript
// 1. After manual validation
function parseUser(json: string): User {
  const data: unknown = JSON.parse(json)

  // Manual validation
  if (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  ) {
    assume<User>(data)
    return data
  }

  throw new Error('Invalid user data')
}

// 2. With external validation library
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
})

function parseUserSafe(json: string): User {
  const data: unknown = JSON.parse(json)
  UserSchema.parse(data) // Runtime validation
  assume<User>(data) // Now safe to assume
  return data
}

// 3. Trusted internal data
function internalTransform(data: InternalType): PublicType {
  // We control both types, transformation is guaranteed safe
  const transformed = { ...data, extra: 'field' }
  assume<PublicType>(transformed)
  return transformed
}
```

### Dangerous Uses

```typescript
// ❌ DANGEROUS - No validation
const user: unknown = await fetch('/api/user').then(r => r.json())
assume<User>(user)
// If API returns wrong shape, runtime errors!

// ❌ DANGEROUS - Blind trust
function dangerousGet(data: unknown): string {
  assume<{ value: string }>(data)
  return data.value // Could crash!
}

// ❌ DANGEROUS - Type mismatch
const num = 42
assume<string>(num)
console.log(num.toUpperCase()) // Runtime error!
```

## Best Practices

### 1. Validate Before Assuming

```typescript
// ✅ Good - validate first
function parseConfig(json: string): Config {
  const data = JSON.parse(json)

  // Validate structure
  if (isValidConfig(data)) {
    assume<Config>(data)
    return data
  }

  throw new Error('Invalid config')
}

// ❌ Avoid - blind assumption
function parseConfig(json: string): Config {
  const data = JSON.parse(json)
  assume<Config>(data) // No validation!
  return data
}
```

### 2. Document Assumptions

```typescript
// ✅ Good - document why it's safe
function transform(data: unknown): Result {
  // SAFETY: data is guaranteed to match Result structure
  // because it comes from our internal database schema
  assume<Result>(data)
  return data
}

// ❌ Avoid - no explanation
function transform(data: unknown): Result {
  assume<Result>(data)
  return data
}
```

### 3. Prefer Type Guards

```typescript
// ✅ Good - type guard with runtime check
import { asUser } from './validators'

function process(data: unknown) {
  asUser(data) // Throws if not valid
  return data.name // Type: User
}

// ❌ Avoid - assume without check
function process(data: unknown) {
  assume<User>(data)
  return data.name // Could crash!
}
```

### 4. Use Only When Necessary

```typescript
// ✅ Good - type guard available
import { isString } from '@sky-modules/core/type-guards'

if (isString(value)) {
  // Type narrowed safely
  return value.toUpperCase()
}

// ❌ Avoid - assume when guard exists
assume<string>(value)
return value.toUpperCase()
```

## Comparison with Alternatives

### vs Type Guards

```typescript
// Type guard - runtime check + type narrowing
import { asString } from '@sky-modules/core/type-guards'

asString(value) // Throws if not string
// value is now string

// assume - type narrowing only
assume<string>(value) // No check!
// value is now string (but might not be!)
```

### vs Type Assertion (as)

```typescript
// Type assertion - compile-time only
const user = data as User

// assume - assertion function form
assume<User>(data)

// Both compile to nothing, same effect
// assume provides function call semantics
```

### vs Non-Null Assertion (!)

```typescript
// Non-null assertion
const value = maybeNull!

// assume equivalent
assume<NonNullable<typeof maybeNull>>(maybeNull)
```

## Safety Guidelines

### When assume() is Acceptable

1. **After Validation** - Manual or library validation already done
2. **Internal Data** - Data from controlled sources you trust
3. **Type Compatibility** - Types are structurally compatible
4. **Performance Critical** - Runtime checks too expensive

### When to Avoid assume()

1. **User Input** - Never trust user-provided data
2. **External APIs** - API responses can change
3. **Uncertain Types** - When you're not sure of the structure
4. **Public APIs** - Library code used by others

## Migration from any

```typescript
// Before - using any
function legacyCode(data: any) {
  return data.user.name // No type safety
}

// After - using assume
interface Data {
  user: { name: string }
}

function legacyCode(data: any) {
  assume<Data>(data)
  return data.user.name // Type-safe access
}
```

## Zero Runtime Cost

```typescript
// Source TypeScript
const data: unknown = getValue()
assume<User>(data)
console.log(data.name)

// Compiled JavaScript
const data = getValue()
console.log(data.name)
// assume() call is completely removed
```

## Type System Escape Hatch

```typescript
// Sometimes TypeScript's type system is too strict
interface A { x: number }
interface B { x: number, y: number }

const a: A = { x: 1 }

// Type error - missing y
const b: B = a

// Escape hatch with assume
assume<B>(a)
const b2: B = a // OK (but dangerous if y is accessed!)
```

## Related Modules

- [core/type-guards](../type-guards/) - Runtime type checking (safer)
- [core/assert](../assert/) - Runtime assertions
- [core/errors](../errors/) - Error handling

## Examples

See [assume.spec.ts](./assume.spec.ts) for comprehensive usage examples and test cases.

## Warning

⚠️ **Use assume() with extreme caution!**

- No runtime validation
- Can lead to runtime errors
- Bypasses TypeScript's safety
- Only use when you're absolutely certain
- Always prefer type guards when possible
- Document why it's safe to assume

**Remember:** With great power comes great responsibility!
