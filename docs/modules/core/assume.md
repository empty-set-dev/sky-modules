# Assume

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  assume utility module
</div>

Zero-runtime type assertions - tell TypeScript to trust you without validation.

## Installation

```typescript
import assume from '@sky-modules/core/assume'
```

## API

### assume\\<T\>(value)

Assert that a value is of type T without runtime validation.

```typescript
assume<T>(value: unknown): asserts value is T
```

**Parameters:**
- `value` - Value to assert type for

**Type Effect:** Narrows `value` to type `T`

**Runtime Effect:** None (no-op, compiles to nothing)

## Usage

```typescript
const data: unknown = JSON.parse(response)

assume<User>(data)

// TypeScript now thinks data is User
console.log(data.name)
console.log(data.email)
```

## Examples

### After Validation

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
})

function parseUser(json: string): User {
  const data: unknown = JSON.parse(json)
  UserSchema.parse(data) // Runtime validation
  assume<User>(data) // Now safe to assume
  return data
}
```

### Type Cast

```typescript
function cast<T>(value: unknown): T {
  assume<T>(value)
  return value
}

const user = cast<User>(rawData)
```

## Warning

⚠️ **No runtime validation!**

```typescript
// DANGEROUS - No validation
const data: unknown = await fetch('/api/user').then(r => r.json())
assume<User>(data)
// If API returns wrong shape, runtime errors!
```

## When to Use

Safe uses:
- After manual validation
- After schema validation (zod, yup, etc.)
- With trusted internal data

Avoid:
- User input
- External APIs
- When uncertain about type
