# Errors

Security-focused error classes for handling prototype pollution and global overwrites.

## Installation

```typescript
import {
  SecurityError,
  PrototypePollutionError,
  GlobalOverwriteError,
  InvalidScopeError,
  DANGEROUS_KEYS
} from '@sky-modules/core/errors'
```

## API

### SecurityError

Base error class for security violations.

```typescript
class SecurityError extends Error {
  constructor(message: string)
}
```

**Parameters:**
- `message` - Error message

### PrototypePollutionError

Thrown when prototype pollution is attempted.

```typescript
class PrototypePollutionError extends SecurityError {
  constructor(key: string)
}
```

**Parameters:**
- `key` - The dangerous key that was attempted

**Message:** `Prototype pollution attempt detected: "<key>"`

### GlobalOverwriteError

Thrown when trying to overwrite a protected global.

```typescript
class GlobalOverwriteError extends SecurityError {
  constructor(key: string)
}
```

**Parameters:**
- `key` - The global being overwritten

**Message:** `Attempt to overwrite protected global: "<key>"`

### InvalidScopeError

Thrown when namespace scope is invalid.

```typescript
class InvalidScopeError extends SecurityError {
  constructor(namespace: string)
}
```

**Parameters:**
- `namespace` - The namespace path

**Message:** `Invalid scope for namespace "<namespace>": cannot be used as namespace container`

### DANGEROUS_KEYS

Array of keys that can lead to prototype pollution.

```typescript
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype']
```

## Usage

### Handling Security Errors

```typescript
import { PrototypePollutionError } from '@sky-modules/core/errors'

try {
  // Potentially unsafe operation
  Object.assign(obj, { __proto__: malicious })
} catch (error) {
  if (error instanceof PrototypePollutionError) {
    console.error('Security violation prevented')
  }
}
```

### Checking for Dangerous Keys

```typescript
import { DANGEROUS_KEYS } from '@sky-modules/core/errors'

function safeAssign(target, source) {
  for (const key in source) {
    if (DANGEROUS_KEYS.includes(key)) {
      throw new PrototypePollutionError(key)
    }
    target[key] = source[key]
  }
}
```

### Validating Scopes

```typescript
import { InvalidScopeError } from '@sky-modules/core/errors'

function validateNamespace(obj, ns) {
  if (typeof obj !== 'object' || obj === null) {
    throw new InvalidScopeError(ns)
  }
}
```

## Notes

- All security errors capture stack traces automatically
- Error names are set to constructor names for better debugging
- Use these errors to prevent prototype pollution attacks
