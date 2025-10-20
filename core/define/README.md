# Define System

The **define system** is the foundation of Sky Core's serialization and network synchronization capabilities. It creates a global registry of all classes and functions, enabling:

- ✅ Serialization with class metadata
- ✅ Deserialization that restores class instances
- ✅ Hot module replacement (HMR)
- ✅ Network synchronization
- ✅ Debugging and introspection

## Quick Start

```typescript
import '@sky-modules/core/define'

// Define a class
@define('app.User')
class User {
    @string name
    @number age

    greet() {
        return `Hello, I'm ${this.name}!`
    }
}

// Create instance
const user = new User()
user.name = 'Anna'
user.age = 25

// Serialize (with class info!)
const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Anna',
//   age: 25
// }

// Deserialize (restores User instance!)
const restored = load(json)
restored.greet() // "Hello, I'm Anna!"
restored instanceof User // true
```

## Core Concepts

### 1. Registry

Every defined entity is stored in a global registry:

```typescript
@define('app.MyClass')
class MyClass { }

// Stored as:
{
    'app.MyClass': {
        name: 'app.MyClass',
        value: MyClass,
        [idSymbol]: 1,        // Unique numeric ID
        [uidSymbol]: 'app.MyClass',  // Full path
        [typeSymbol]: 'class',       // Type: 'class' | 'func' | 'object'
        [nameSymbol]: 'MyClass'      // Short name
    }
}
```

### 2. Metadata Symbols

Each registered entity gets metadata attached via Symbols:

- `[idSymbol]` - Unique numeric identifier for network protocol
- `[uidSymbol]` - Full path string for deserialization
- `[nameSymbol]` - Short name for debugging
- `[typeSymbol]` - Entity type ('class', 'func', 'object', 'array')

### 3. Schema System

Define reactive data structures with decorators:

```typescript
@define('app.User')
class User {
    @string name      // Reactive string property
    @number age       // Reactive number property
    @boolean active   // Reactive boolean property
    @array(Post) posts // Reactive array of Posts
}
```

## API Reference

### @define(name: string)

Register a class in the global registry.

```typescript
@define('namespace.ClassName')
class MyClass {
    // ...
}
```

**Parameters:**
- `name` - Unique identifier (recommended: `domain.module.Class`)

**Returns:** Class decorator

**Example:**
```typescript
@define('game.entities.Player')
class Player {
    @string name
    @number health = 100
}
```

### define(name: string, value: any)

Register a function or object.

```typescript
define('app.utils.helper', helper)
export function helper() {
    // ...
}
```

**Parameters:**
- `name` - Unique identifier
- `value` - Function or object to register

**Returns:** The value (for chaining)

**Example:**
```typescript
define('app.config', config)
export const config = {
    apiUrl: 'https://api.example.com'
}
```

### schema(name: string, schemaObject: object)

Define a reusable schema.

```typescript
const AddressSchema = schema('app.Address', {
    street: string,
    city: string,
    country: string
})
```

**Parameters:**
- `name` - Unique identifier
- `schemaObject` - Object describing the structure

**Returns:** The schema object

## Property Decorators

### Primitive Types

```typescript
@string name        // string
@number age         // number
@boolean active     // boolean
```

### Optional Types

```typescript
@optional.string nickname    // string | undefined
@optional.number score       // number | undefined
@optional.boolean premium    // boolean | undefined
```

### Nullable Types

```typescript
@nullable.string avatar      // string | null
@nullable.number lastSeen    // number | null
```

### Nullish Types

```typescript
@nullish.string bio          // string | null | undefined
```

### Complex Types

```typescript
@object(Address) address     // Nested object
@array(User) friends         // Array of objects
@func onUpdate               // Function property
```

## Advanced Usage

### Custom Schemas

Define complex nested structures:

```typescript
const PersonSchema = {
    name: string,
    age: number,
    address: {
        street: string,
        city: string
    },
    friends: [PersonSchema] // Recursive!
}

@define('app.Person')
class Person {
    @object(PersonSchema) data
}
```

### Hot Module Replacement

The define system supports HMR:

```typescript
if (import.meta.hot) {
    import.meta.hot.accept()

    // Classes are automatically re-registered
    // Existing instances keep working!
}
```

### Introspection

Access the registry for debugging:

```typescript
import local from '@sky-modules/core/define/local'

// Get all defined entities
console.log(local.defines)

// Find a specific class
const UserClass = local.defines['app.User']?.value
console.log(UserClass[local.uidSymbol]) // 'app.User'
```

## Serialization

### save(object)

Serialize an object with class metadata:

```typescript
const user = new User()
user.name = 'Anna'

const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Anna',
//   age: 25
// }
```

### load(json)

Deserialize and restore class instance:

```typescript
const restored = load(json)
restored instanceof User // true
restored.greet() // Methods work!
```

### plain(schema, data)

Create typed object from plain data:

```typescript
const UserSchema = {
    name: string,
    age: number
}

const user = plain(UserSchema, {
    name: 'Anna',
    age: 25
})
// user is now reactive and typed!
```

## Best Practices

### 1. Use Namespaces

```typescript
// ✅ Good - organized hierarchy
@define('game.entities.Player')
@define('game.systems.Physics')
@define('ui.components.Button')

// ❌ Bad - flat, potential conflicts
@define('Player')
@define('Physics')
```

### 2. Define Everything You Serialize

```typescript
// ✅ Good
@define('app.User')
class User {
    @define('app.Settings')
    settings: Settings
}

// ❌ Bad - Settings won't serialize correctly
class Settings { }
```

### 3. Use TypeScript Types

```typescript
// ✅ Good - type-safe
@define('app.User')
class User {
    @string name: string
    @number age: number
}

// ❌ Bad - loses type safety
class User {
    @string name
    @number age
}
```

### 4. Avoid Circular References (for now)

```typescript
// ⚠️ Be careful
@define('app.User')
class User {
    @object(User) friend // Circular reference
}

// Consider using IDs instead:
class User {
    @number friendId
}
```

## Debugging

### Check if Entity is Defined

```typescript
import local from '@sky-modules/core/define/local'

function isDefined(name: string): boolean {
    return local.defines[name] != null
}

console.log(isDefined('app.User')) // true/false
```

### List All Definitions

```typescript
import local from '@sky-modules/core/define/local'

Object.keys(local.defines).forEach(name => {
    const def = local.defines[name]
    console.log(`${name} (${def.value[local.typeSymbol]})`)
})
```

### Inspect Entity Metadata

```typescript
const user = new User()

console.log(user.constructor[local.uidSymbol])    // 'app.User'
console.log(user.constructor[local.idSymbol])     // 1
console.log(user.constructor[local.nameSymbol])   // 'User'
console.log(user.constructor[local.typeSymbol])   // 'class'
```

## Common Patterns

### Singleton Pattern

```typescript
@define('app.GameState')
class GameState {
    private static instance: GameState

    static getInstance(): GameState {
        if (!this.instance) {
            this.instance = new GameState()
        }
        return this.instance
    }
}
```

### Factory Pattern

```typescript
@define('app.EntityFactory')
class EntityFactory {
    create(type: string): Entity {
        const EntityClass = local.defines[`app.entities.${type}`]?.value
        if (!EntityClass) {
            throw new Error(`Unknown entity type: ${type}`)
        }
        return new EntityClass()
    }
}
```

### Mixin Pattern

```typescript
@define('app.mixins.Movable')
class Movable {
    @number x = 0
    @number y = 0

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }
}

@define('app.Player')
@mixin(Movable)
class Player {
    @string name
}
```

## Limitations

1. **No circular schemas** (yet) - Use IDs to reference parent objects
2. **Symbol properties** are not serialized
3. **Functions in data** are not serialized (use `@func` decorator)
4. **Prototype chain** must be defined

## Migration Guide

### From Plain Classes

```typescript
// Before
class User {
    name: string = ''
    age: number = 0
}

// After
@define('app.User')
class User {
    @string name = ''
    @number age = 0
}
```

### From JSON Serialization

```typescript
// Before
const json = JSON.stringify(user)
const parsed = JSON.parse(json) // Plain object!

// After
const json = save(user)
const restored = load(json) // User instance!
```

## Performance

- **Registry lookup**: O(1) constant time
- **Serialization**: O(n) where n is number of properties
- **Memory overhead**: ~100 bytes per defined class
- **Network overhead**: ~20-50 bytes for class metadata

## See Also

- [Schema System](./types.ts) - Type definitions
- [Reactivity](./reactivePropertyDescriptors.ts) - Reactive properties
- [Sharing](./share.ts) - Network synchronization
