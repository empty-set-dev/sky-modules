# Sky Modules

Powerful TypeScript utility modules for modern development

## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Merge objects with type safety
const result = mergeNamespace(obj1, obj2)

// Add to global namespace
globalify({ myUtility: someFunction })
```

## Modules


### Table of Contents

- **Core Modules**
    - [Array](#array)
    - [bind](#bind)
    - [mergeNamespace](#mergenamespace)
    - [not](#not)


## Core Modules

### Array

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/Array)

### Array Extensions

This module extends the native JavaScript Array prototype with additional utility methods.

#### Methods

##### `last(): T`

Returns the last element of the array.

**Returns:** The last element of the array, or `undefined` if the array is empty.

**Example:**
```typescript
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

const empty: number[] = []
console.log(empty.last()) // undefined
```

##### `remove(element: T): boolean`

Removes the first occurrence of the specified element from the array.

**Parameters:**
- `element: T` - The element to remove from the array

**Returns:** `true` if the element was found and removed, `false` otherwise.

**Example:**
```typescript
const fruits = ['apple', 'banana', 'apple', 'orange']
console.log(fruits.remove('banana')) // true
console.log(fruits) // ['apple', 'apple', 'orange']

console.log(fruits.remove('grape')) // false
console.log(fruits) // ['apple', 'apple', 'orange'] (unchanged)
```

##### `shuffle(): this`

Shuffles the array in place using the Fisher-Yates algorithm.

**Returns:** The same array instance (for method chaining).

**Example:**
```typescript
const numbers = [1, 2, 3, 4, 5]
numbers.shuffle()
console.log(numbers) // [3, 1, 5, 2, 4] (random order)
```

##### `toShuffled(): Array<T>`

Creates a new shuffled copy of the array without modifying the original.

**Returns:** A new array with the same elements in random order.

**Example:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (unchanged)
console.log(shuffled) // [3, 1, 5, 2, 4] (random order)
```

#### Implementation Details

All methods are implemented using `Object.defineProperty` with:
- `enumerable: false` - won't appear in `for...in` or `Object.keys()`
- `writable: true` - can be overridden if needed
- `configurable: true` - can be deleted or reconfigured

Each method checks if it already exists before defining it.

#### Usage

Import all extensions:

```typescript
import '@sky-modules/core/Array'
```

Or import individual methods:

```typescript
import '@sky-modules/core/Array/Array+last'
import '@sky-modules/core/Array/Array+remove'
import '@sky-modules/core/Array/Array+shuffle'
import '@sky-modules/core/Array/Array+toShuffled'
```

[← Back to Table of Contents](#table-of-contents)

---

### bind

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/bind)

TypeScript decorator for automatic method binding to class instances.

#### Features

- Automatic `this` context binding
- Works as a property decorator
- Lazy initialization
- Memory efficient (uses Symbol keys)

#### API

##### `bind`

A TypeScript decorator that automatically binds class methods to their instance.

###### Decorator Signature

```typescript
function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
): PropertyDescriptor
```

#### Usage

Import the decorator:

```typescript
import { bind } from '@sky-modules/core/bind'
```

Or use as global:

```typescript
import '@sky-modules/core/bind/global'
```

##### Basic Example

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

##### With Event Handlers

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

##### With Callbacks

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

#### Implementation Details

- Uses `Symbol()` for private storage to avoid property name conflicts
- Lazily binds on first access for better performance
- Returns configurable property descriptor (can be overridden)
- Bound function is cached after first access

#### TypeScript Support

The decorator works with TypeScript's `experimentalDecorators` option enabled in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

#### Benefits

1. **No manual binding**: No need to bind in constructor or use arrow functions
2. **Memory efficient**: Only one bound function per instance
3. **Type safe**: Full TypeScript support
4. **Framework friendly**: Works with any framework that uses callbacks

#### Alternatives

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

[← Back to Table of Contents](#table-of-contents)

---

### mergeNamespace

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/mergeNamespace)

Advanced namespace merging with type safety

The `mergeNamespace` utility provides powerful object merging capabilities while preserving function behavior and adding new properties. Perfect for configuration objects, plugin systems, and complex data structures.

```bash
npm install @sky-modules/core
```

#### Usage

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Basic usage
const target = { func: () => 'hello' }
const source = { func: { newProp: 'world' } }

mergeNamespace(target, source)

console.log(target.func())         // → 'hello'
console.log(target.func.newProp)   // → 'world'
```

#### API Reference

##### `mergeNamespace<T, S>(target: T, source: S): T & S`

Merges properties from `source` into `target`, preserving existing functionality.

###### Parameters

- `target` - The target object to merge into
- `source` - The source object to merge from

###### Returns

The merged object with combined type `T & S`

#### Examples

##### Configuration Objects

```typescript
const config = {
    api: () => fetch('/api'),
    database: () => connectDB()
}

const extensions = {
    api: {
        timeout: 5000,
        retries: 3
    },
    database: {
        pool: { min: 1, max: 10 }
    }
}

mergeNamespace(config, extensions)

// Use as function
const response = await config.api()

// Use as object
const timeout = config.api.timeout  // → 5000
const pool = config.database.pool   // → { min: 1, max: 10 }
```

##### Plugin Systems

```typescript
class Logger {
    log(message: string) {
        console.log(`[LOG] ${message}`)
    }
}

const logger = new Logger()

// Add metadata to logger
mergeNamespace(logger, {
    log: {
        level: 'info',
        timestamp: true,
        format: 'json'
    }
})

// Use as method
logger.log('Hello world')

// Use configuration
if (logger.log.timestamp) {
    // Add timestamp logic
}
```

##### Functional Configuration

```typescript
const math = {
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b
}

const mathConfig = {
    add: { precision: 2 },
    multiply: { overflow: 'error' }
}

mergeNamespace(math, mathConfig)

// Functions work normally
const sum = math.add(1.234, 2.345)  // → 3.579

// Configuration available
const precision = math.add.precision  // → 2
```

#### Type Safety

The utility provides full TypeScript support:

```typescript
interface ApiConfig {
    timeout: number
    retries: number
}

interface Api {
    (): Promise<Response>
    config?: ApiConfig
}

const api: Api = () => fetch('/api')

mergeNamespace(api, {
    config: { timeout: 5000, retries: 3 }
})

// TypeScript knows about both function and properties
const response = await api()           // ✓ Function call
const timeout = api.config?.timeout    // ✓ Property access
```

#### Performance

- **Zero overhead** - No runtime performance impact
- **Memory efficient** - Properties are added directly
- **Type optimized** - Full TypeScript inference

#### Error Handling

```typescript
try {
    mergeNamespace(target, source)
} catch (err) {
    // Handle merge conflicts or type issues
    console.error('Merge failed:', err)
}
```

#### Advanced Usage

##### Nested Merging

```typescript
const complex = {
    utils: {
        string: () => 'helper',
        number: () => 42
    }
}

const extensions = {
    utils: {
        string: {
            trim: true,
            lowercase: false
        },
        number: {
            precision: 2
        }
    }
}

mergeNamespace(complex, extensions)

// All combinations work
complex.utils.string()                    // → 'helper'
complex.utils.string.trim                 // → true
complex.utils.number()                    // → 42
complex.utils.number.precision            // → 2
```

##### Conditional Merging

```typescript
const feature = {
    process: (data: any) => processData(data)
}

const conditionalConfig = {
    process: {
        enabled: process.env.NODE_ENV === 'production',
        debug: process.env.DEBUG === 'true'
    }
}

mergeNamespace(feature, conditionalConfig)

if (feature.process.enabled) {
    feature.process(data)
}
```

#### Related

This module works well with other Sky utilities for advanced object manipulation and configuration management.

#### Source Code

View the [source code on GitHub](https://github.com/empty-set-games/sky-modules/blob/main/core/mergeNamespace/index.ts).

[← Back to Table of Contents](#table-of-contents)

---

### not

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/not)

Type-safe null/undefined checking utilities with custom error types.

#### Features

- Type-safe null, undefined, and nullish checks
- Custom error types for better error handling
- Assertion functions for type narrowing
- TypeScript's type guards support

#### API

##### Undefined Checks

###### `notUndefined<T>(value: undefined | T, message: string): T`

Returns the value if it's not undefined, otherwise throws `UndefinedError`.

```typescript
const value: string | undefined = getValue()
const result = notUndefined(value, 'Value must be defined')
// result is now typed as string
```

###### `assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T`

Asserts that value is not undefined using TypeScript's assertion signatures.

```typescript
const value: string | undefined = getValue()
assertIsNotUndefined(value, 'Value must be defined')
// value is now typed as string in the rest of the scope
```

###### `UndefinedError`

Custom error class for undefined values.

##### Null Checks

###### `notNull<T>(value: null | T, message: string): T`

Returns the value if it's not null, otherwise throws `NullError`.

```typescript
const value: string | null = getValue()
const result = notNull(value, 'Value must not be null')
// result is now typed as string
```

###### `assertIsNotNull<T>(value: null | T, message: string): asserts value is T`

Asserts that value is not null using TypeScript's assertion signatures.

```typescript
const value: string | null = getValue()
assertIsNotNull(value, 'Value must not be null')
// value is now typed as string in the rest of the scope
```

###### `NullError`

Custom error class for null values.

##### Nullish Checks

###### `notNullish<T>(value: undefined | null | T, message: string): T`

Returns the value if it's not nullish (null or undefined), otherwise throws `NullishError`.

```typescript
const value: string | null | undefined = getValue()
const result = notNullish(value, 'Value must be defined')
// result is now typed as string
```

###### `assertIsNotNullish<T>(value: undefined | null | T, message: string): asserts value is T`

Asserts that value is not nullish using TypeScript's assertion signatures.

```typescript
const value: string | null | undefined = getValue()
assertIsNotNullish(value, 'Value must be defined')
// value is now typed as string in the rest of the scope
```

###### `NullishError`

Custom error class for nullish values.

#### Usage

Import the module:

```typescript
import '@sky-modules/core/not'
```

Or import individual functions:

```typescript
import { notUndefined, notNull, notNullish } from '@sky-modules/core/not'
```

#### Error Messages

All errors include descriptive messages:

- `UndefinedError`: "unexpected undefined: [your message]"
- `NullError`: "unexpected null: [your message]"
- `NullishError`: "unexpected nullish: [your message]"

[← Back to Table of Contents](#table-of-contents)

---


## Development

```bash
# Clone the repository
git clone https://github.com/empty-set-dev/sky-modules.git
cd sky-modules

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Documentation

- 📖 [Full Documentation](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Usage Examples](https://empty-set-dev.github.io/sky-modules/playground)
- 🛠️ [API Reference](https://empty-set-dev.github.io/sky-modules/modules)

## License

ISC License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Empty Set Dev
