# mixin

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  mixin utility module
</div>

Decorator for mixing in functionality from one class into another.

## Installation

```typescript
import mixin from '@sky-modules/core/mixin'
```

## API

### mixin(mixinConstructor)

Create a class decorator that adds methods and properties from a mixin class.

```typescript
mixin<M extends Class, T extends Class>(
  mixinConstructor: M
): (constructor: T) => void
```

**Parameters:**
- `mixinConstructor` - Class to use as mixin source

**Returns:** Decorator function that modifies the target class prototype

## Usage

### Basic Mixin

```typescript
class Logger {
  log(message: string) {
    console.log(message)
  }
}

@mixin(Logger)
class Service {
  name = 'MyService'
}

const service = new Service()
service.log('Service initialized') // Inherited from Logger
```

### Multiple Mixins

```typescript
class Validator {
  validate(data: unknown): boolean {
    return data !== null && data !== undefined
  }
}

class Serializer {
  serialize(obj: unknown): string {
    return JSON.stringify(obj)
  }
}

@mixin(Validator)
@mixin(Serializer)
class DataHandler {
  process(data: unknown) {
    if (this.validate(data)) {
      return this.serialize(data)
    }
  }
}
```

### Mixin with Hooks

```typescript
class Lifecycle {
  __hooks = {
    onInit: () => console.log('Initialized')
  }
}

@mixin(Lifecycle)
class Component {
  constructor() {
    this.onInit?.()
  }
}
```
