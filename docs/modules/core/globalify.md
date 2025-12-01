# Globalify

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  globalify utility module
</div>

Add modules to the global scope with optional namespace support and security validation.

## Installation

```typescript
import globalify from '@sky-modules/core/globalify'
```

## API

### globalify(module)

Add module properties directly to global scope.

```typescript
globalify(module: Record<PropertyKey, unknown>): void
```

**Parameters:**
- `module` - Object with properties to add to global scope

**Behavior:**
- Merges module properties into global object
- Validates keys to prevent prototype pollution
- Throws PrototypePollutionError for dangerous keys

**Returns:** void

### globalify.namespace(ns, module)

Add module properties to a nested namespace in global scope.

```typescript
globalify.namespace(ns: string, module: Record<PropertyKey, unknown>): void
```

**Parameters:**
- `ns` - Dot-separated namespace path (e.g., 'app.utils')
- `module` - Object with properties to add to namespace

**Behavior:**
- Creates nested namespace path if needed
- Validates all namespace keys for security
- Merges module properties into target namespace
- Throws InvalidScopeError if namespace scope is invalid

**Returns:** void

## Usage

### Add to Global Directly

```typescript
import globalify from '@sky-modules/core/globalify'

globalify({
  MyClass: class MyClass { },
  myFunction: () => console.log('Hello'),
  myValue: 42,
})

// Now accessible as:
console.log(MyClass)
console.log(myFunction())
console.log(myValue)
```

### Add to Nested Namespace

```typescript
globalify.namespace('app.services', {
  logger: {
    log: (msg) => console.log(msg),
    error: (msg) => console.error(msg),
  },
  cache: new Map(),
})

// Now accessible as:
app.services.logger.log('test')
app.services.cache.set('key', 'value')
```

### Multiple Namespaces

```typescript
globalify.namespace('app.config', {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
})

globalify.namespace('app.state', {
  user: null,
  isLoading: false,
})

// Access:
console.log(app.config.apiUrl)
console.log(app.state.user)
```

## Security

The module prevents prototype pollution by:
- Rejecting dangerous keys: `__proto__`, `constructor`, `prototype`
- Validating namespace scopes are objects or functions
- Throwing security errors for invalid operations

```typescript
// This throws PrototypePollutionError
globalify({
  __proto__: malicious,
})

// This throws InvalidScopeError
globalify.namespace('undefined.path', {
  key: 'value',
})
```

## Notes

- Safe alternative to eval() for dynamic globals
- Validates all keys for security
- Preserves existing namespace structures
- Keys are not enumerable in source module
