# Utility Types

Advanced TypeScript utility types for type transformations.

## Installation

```typescript
import type { DeepPartial, UnionToIntersection, UnionToTuple } from '@sky-modules/core/utility-types'
```

## API

### DeepPartial\<T\>

Make all properties in T optional recursively.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

**Type Parameters:**
- `T` - Object type to make partially optional

**Behavior:**
- Recursively makes all nested properties optional
- Works with nested objects, arrays, and complex structures
- Preserves type safety through recursion

### UnionToIntersection\<U\>

Convert a union type to an intersection type.

```typescript
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
```

**Type Parameters:**
- `U` - Union type to convert

**Behavior:**
- Transforms `A | B | C` to `A & B & C`
- Useful for combining types from unions
- Uses function contravariance for type inference

### UnionToTuple\<U\>

Convert a union type to a tuple type.

```typescript
type UnionToTuple<U> =
  UnionToIntersection<U extends unknown ? (u: U) => void : never> extends (v: infer V) => void
    ? [...UnionToTuple<Exclude<U, V>>, V]
    : []
```

**Type Parameters:**
- `U` - Union type to convert

**Behavior:**
- Transforms `A | B | C` to `[A, B, C]`
- Creates tuple with each union member
- Recursive implementation using UnionToIntersection

## Usage

### DeepPartial for Configuration Objects

```typescript
interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
    headers: {
      authorization: string
      'content-type': string
    }
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

type PartialConfig = DeepPartial<AppConfig>

const config: PartialConfig = {
  api: {
    baseUrl: 'https://api.example.com'
    // timeout and headers are optional
  }
  // cache is optional
}
```

### UnionToIntersection for Type Merging

```typescript
type Identifiable = { id: string }
type Timestamped = { createdAt: Date }
type Named = { name: string }

type Combined = UnionToIntersection<Identifiable | Timestamped | Named>
// Results in: { id: string } & { createdAt: Date } & { name: string }

const obj: Combined = {
  id: '1',
  createdAt: new Date(),
  name: 'Item'
}
```

### UnionToTuple for Type Exhaustiveness

```typescript
type Status = 'pending' | 'active' | 'completed' | 'failed'

type StatusTuple = UnionToTuple<Status>
// Results in: ['pending', 'active', 'completed', 'failed'] (or similar order)

function processAllStatuses(statuses: StatusTuple) {
  statuses.forEach(status => {
    console.log(`Processing: ${status}`)
  })
}
```

### Nested DeepPartial

```typescript
interface User {
  profile: {
    personal: {
      firstName: string
      lastName: string
    }
    contact: {
      email: string
      phone: string
    }
  }
  settings: {
    theme: string
    notifications: boolean
  }
}

type PartialUser = DeepPartial<User>

const update: PartialUser = {
  profile: {
    personal: {
      firstName: 'John'
      // lastName optional
    }
    // contact optional
  }
  // settings optional
}
```

### Generic Function with DeepPartial

```typescript
function mergeConfig<T extends object>(
  defaults: T,
  overrides: DeepPartial<T>
): T {
  return deepMerge(defaults, overrides)
}

const config = mergeConfig(
  { api: { timeout: 5000, retries: 3 } },
  { api: { timeout: 10000 } }
)
```

## Notes

- All types are registered globally on the global namespace
- No runtime overhead - purely compile-time type transformations
- Useful for API response mapping and configuration merging
- DeepPartial is recursive - safe for deeply nested structures
- UnionToIntersection requires conditional types understanding
- UnionToTuple preserves union members in tuple form for exhaustiveness checking
