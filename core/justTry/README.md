# justTry

Execute a function and return result or `undefined` on error.

## Installation

```typescript
import justTry from '@sky-modules/core/justTry'
```

## API

### justTry(fn)

Execute a function with automatic error suppression.

```typescript
justTry<T>(fn: () => T): Promise<undefined | T>
```

**Parameters:**
- `fn` - Function to execute (can be async)

**Returns:** Promise that resolves to function result or `undefined` if error occurs

## Usage

### Parsing with Fallback

```typescript
const data = await justTry(() => JSON.parse(jsonString))
if (data === undefined) {
  console.log('Invalid JSON, using defaults')
}
```

### Safe API Calls

```typescript
const user = await justTry(async () => {
  return await fetch('/api/user').then(r => r.json())
})

if (user === undefined) {
  console.log('Failed to fetch user')
}
```

### Graceful Degradation

```typescript
const location = await justTry(() => {
  return navigator.geolocation.getCurrentPosition()
})

const fallbackLocation = location ?? { lat: 0, lng: 0 }
```
