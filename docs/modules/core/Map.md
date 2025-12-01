# Map Extensions

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Map utility module
</div>

Type-safe Map.has() with automatic type narrowing for Map.get().

## Installation

```typescript
import '@sky-modules/core/Map'
```

## API

### Map.prototype.has(key)

Check if map has a key with type narrowing.

```typescript
has<P extends K>(key: P): this is { get(key: P): V } & this
```

**Parameters:**
- `key` - Key to check

**Returns:** `true` if key exists, `false` otherwise

**Type Effect:** After `has(key)` returns `true`, TypeScript knows `get(key)` returns `V` (not `V | undefined`)

## Usage

### Before Extension

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Type: User | undefined
  if (user) {
    console.log(user.name)
  }
}
```

### After Extension

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Type: User
  console.log(user.name) // No check needed
}
```

## Example

```typescript
const cache = new Map<string, Data>()

function getData(key: string): Data {
  if (cache.has(key)) {
    return cache.get(key) // Type: Data (not Data | undefined)
  }
  throw new Error('Not found')
}
```
