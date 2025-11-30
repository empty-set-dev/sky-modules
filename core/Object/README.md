# Object Extensions

Deep freeze utility for immutable object trees.

## Installation

```typescript
import '@sky-modules/core/Object'
```

## API

### Object.freezeDeep(object)

Recursively freeze an object and all its nested properties.

```typescript
Object.freezeDeep<T extends Record<string, unknown>>(object: T): Readonly<T>
```

### Object.isFreezable(value)

Check if a value can be frozen.

```typescript
Object.isFreezable(value: unknown): value is Record<string, unknown>
```

### Object.isDeeplyFrozen(object)

Check if an object has been deeply frozen.

```typescript
Object.isDeeplyFrozen(object: Object): boolean
```

## Usage

```typescript
const config = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000
  }
}

Object.freezeDeep(config)

// All modifications fail
config.api.url = 'changed'      // No effect
config.api.timeout = 10000      // No effect
```

## Deep vs Shallow Freeze

```typescript
const obj = {
  a: 1,
  nested: { b: 2 }
}

// Shallow freeze
Object.freeze(obj)
obj.a = 10              // No effect
obj.nested.b = 20       // MODIFIED!

// Deep freeze
Object.freezeDeep(obj)
obj.a = 10              // No effect
obj.nested.b = 20       // No effect
```

## When to Use

Use for:
- Application configuration
- Constants and enums
- Immutable reference data

Avoid for:
- Large dynamic datasets
- Frequently changing data
- Performance-critical paths
