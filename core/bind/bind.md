# bind

TypeScript decorator for automatic method binding to class instances.

## Features

- Automatic `this` context binding
- Works as a property decorator
- Lazy initialization
- Memory efficient (uses Symbol keys)

## API

### `bind`

A TypeScript decorator that automatically binds class methods to their instance.

#### Decorator Signature

```typescript
function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
): PropertyDescriptor
```

## Usage

Import the decorator:

```typescript
import { bind } from '@sky-modules/core/bind'
```

Or use as global:

```typescript
import '@sky-modules/core/bind/global'
```

### Basic Example

```typescript
import { bind } from '@sky-modules/core/bind'

class MyClass {
    name = 'MyClass'

    @bind
    greet() {
        return `Hello from ${this.name}`
    }
}

const instance = new MyClass()
const greet = instance.greet

// Works correctly without explicit binding
console.log(greet()) // "Hello from MyClass"
```

### With Event Handlers

```typescript
class Button {
    label = 'Click me'

    @bind
    handleClick() {
        console.log(`${this.label} was clicked`)
    }

    render() {
        // Safe to pass as callback
        element.addEventListener('click', this.handleClick)
    }
}
```

### With Callbacks

```typescript
class DataProcessor {
    prefix = 'Processed: '

    @bind
    process(data: string) {
        return this.prefix + data
    }

    processAll(items: string[]) {
        // Safe to use as callback
        return items.map(this.process)
    }
}
```

## Implementation Details

- Uses `Symbol()` for private storage to avoid property name conflicts
- Lazily binds on first access for better performance
- Returns configurable property descriptor (can be overridden)
- Bound function is cached after first access

## TypeScript Support

The decorator works with TypeScript's `experimentalDecorators` option enabled in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

## Benefits

1. **No manual binding**: No need to bind in constructor or use arrow functions
2. **Memory efficient**: Only one bound function per instance
3. **Type safe**: Full TypeScript support
4. **Framework friendly**: Works with any framework that uses callbacks

## Alternatives

Without `@bind`:

```typescript
class MyClass {
    constructor() {
        // Manual binding in constructor
        this.greet = this.greet.bind(this)
    }

    greet() {
        return `Hello from ${this.name}`
    }
}

// Or arrow function (less flexible)
class MyClass {
    greet = () => {
        return `Hello from ${this.name}`
    }
}
```

With `@bind` decorator, the binding is handled automatically and efficiently.
