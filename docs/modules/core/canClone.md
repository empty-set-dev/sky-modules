# canClone

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  canClone utility module
</div>

Check if an object can be cloned using `structuredClone`.

## Installation

```typescript
import canClone from '@sky-modules/core/canClone'
```

## API

### canClone(object)

Test if an object is compatible with `structuredClone`.

```typescript
canClone(object: unknown): boolean
```

**Parameters:**
- `object` - Object to test for cloneability

**Returns:** `true` if the object can be cloned, `false` otherwise

## Usage

### Basic Check

```typescript
canClone({ name: 'John' }) // true
canClone([1, 2, 3]) // true
canClone(new Map()) // false (Maps cannot be cloned)
canClone(() => {}) // false (functions cannot be cloned)
```

### Conditional Cloning

```typescript
const original = { data: [1, 2, 3] }

if (canClone(original)) {
  const cloned = structuredClone(original)
  cloned.data.push(4)
  console.log(original.data) // [1, 2, 3]
  console.log(cloned.data)   // [1, 2, 3, 4]
}
```

### Safe Serialization

```typescript
function saveToStorage(obj: unknown) {
  if (canClone(obj)) {
    localStorage.setItem('data', JSON.stringify(obj))
  } else {
    console.warn('Object cannot be safely cloned')
  }
}
```
