# Class

Type alias for constructor functions.

## Installation

```typescript
import type Class from '@sky-modules/core/Class'
```

## API

### Class<T>

Type representing a constructor function.

```typescript
type Class<T extends new (...args: any[]) => any = new (...args: any[]) => any> = T
```

**Type Parameters:**
- `T` - Constructor function type (defaults to generic constructor)

## Usage

### Type Annotation

```typescript
function createInstance<T>(ClassRef: Class<new () => T>): T {
  return new ClassRef()
}

class User {
  name = 'John'
}

const user = createInstance(User)
```

### Generic Constraints

```typescript
function extend<T extends Class>(Base: T) {
  return class extends Base {
    extended = true
  }
}
```

### Dependency Injection

```typescript
class Container {
  register<T>(token: symbol, ClassRef: Class<new () => T>): void {
    // Register class for DI
  }

  resolve<T>(token: symbol): T {
    // Resolve and instantiate
  }
}
```
