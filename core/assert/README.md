# Assert

Runtime assertion utilities for validating invariants.

## Overview

The assert module provides simple runtime assertion functionality for validating assumptions and invariants in your code. When an assertion fails, it throws an `AssertionError` with a descriptive message.

**Key Features:**
- Simple assertion API
- Custom error type
- Descriptive error messages
- Zero dependencies

## Installation

```typescript
import { assert, AssertionError } from '@sky-modules/core/assert'
```

## API Reference

### assert(expression, message)

Assert that an expression is truthy.

```typescript
assert(expression: unknown, message: string): void
```

**Parameters:**
- `expression` - Expression to check (must be truthy)
- `message` - Error message if assertion fails

**Throws:** `AssertionError` if expression is falsy

**Example:**
```typescript
assert(user !== null, 'User must not be null')
assert(count > 0, 'Count must be positive')
assert(Array.isArray(items), 'Items must be an array')
```

### AssertionError

Custom error class for assertion failures.

```typescript
class AssertionError extends Error {
  constructor(message: string)
}
```

**Example:**
```typescript
try {
  assert(false, 'This will fail')
} catch (error) {
  if (error instanceof AssertionError) {
    console.log(error.message) // "assertion failed: This will fail"
  }
}
```

## Usage Patterns

### Precondition Checks

```typescript
function divide(a: number, b: number): number {
  assert(b !== 0, 'Divisor cannot be zero')
  return a / b
}

divide(10, 2)  // OK
divide(10, 0)  // AssertionError: assertion failed: Divisor cannot be zero
```

### Postcondition Checks

```typescript
function calculateDiscount(price: number, percent: number): number {
  const discount = price * (percent / 100)

  assert(discount >= 0, 'Discount must be non-negative')
  assert(discount <= price, 'Discount cannot exceed price')

  return discount
}
```

### Invariant Validation

```typescript
class BankAccount {
  private balance = 0

  deposit(amount: number) {
    assert(amount > 0, 'Deposit amount must be positive')

    this.balance += amount

    assert(this.balance >= 0, 'Balance invariant violated')
  }

  withdraw(amount: number) {
    assert(amount > 0, 'Withdrawal amount must be positive')
    assert(amount <= this.balance, 'Insufficient funds')

    this.balance -= amount

    assert(this.balance >= 0, 'Balance invariant violated')
  }
}
```

### Array Validation

```typescript
function processItems(items: unknown): void {
  assert(Array.isArray(items), 'Items must be an array')
  assert(items.length > 0, 'Items array cannot be empty')

  items.forEach(item => {
    assert(item != null, 'Item cannot be null or undefined')
    processItem(item)
  })
}
```

### Configuration Validation

```typescript
interface Config {
  apiUrl: string
  timeout: number
  retries: number
}

function validateConfig(config: unknown): asserts config is Config {
  assert(typeof config === 'object' && config !== null, 'Config must be an object')

  const c = config as any

  assert(typeof c.apiUrl === 'string', 'apiUrl must be a string')
  assert(c.apiUrl.startsWith('http'), 'apiUrl must start with http')

  assert(typeof c.timeout === 'number', 'timeout must be a number')
  assert(c.timeout > 0, 'timeout must be positive')

  assert(typeof c.retries === 'number', 'retries must be a number')
  assert(c.retries >= 0, 'retries must be non-negative')
}

const config = loadConfig()
validateConfig(config)
// config is now Config type
```

### State Machine Validation

```typescript
type State = 'idle' | 'loading' | 'success' | 'error'

class StateMachine {
  private state: State = 'idle'

  load() {
    assert(this.state === 'idle', 'Can only load from idle state')
    this.state = 'loading'
  }

  success() {
    assert(this.state === 'loading', 'Can only succeed from loading state')
    this.state = 'success'
  }

  error() {
    assert(this.state === 'loading', 'Can only error from loading state')
    this.state = 'error'
  }

  reset() {
    assert(this.state !== 'loading', 'Cannot reset while loading')
    this.state = 'idle'
  }
}
```

### Boundary Checks

```typescript
function getArrayElement<T>(array: T[], index: number): T {
  assert(index >= 0, 'Index must be non-negative')
  assert(index < array.length, 'Index out of bounds')

  return array[index]
}
```

### Type Narrowing

```typescript
function processValue(value: string | number | null) {
  assert(value !== null, 'Value cannot be null')

  if (typeof value === 'string') {
    // Process string
  } else {
    // Must be number
    assert(typeof value === 'number', 'Value must be number')
  }
}
```

## Best Practices

### 1. Use Descriptive Messages

```typescript
// ✅ Good - clear message
assert(age >= 18, 'User must be 18 or older')

// ❌ Avoid - vague message
assert(age >= 18, 'Invalid age')
```

### 2. Assert at Boundaries

```typescript
// ✅ Good - validate at function entry
function withdraw(amount: number) {
  assert(amount > 0, 'Amount must be positive')
  assert(amount <= balance, 'Insufficient funds')
  // ... implementation
}

// ❌ Avoid - deep in implementation
function withdraw(amount: number) {
  // ... lots of code
  if (amount <= 0) throw new Error('Invalid') // Too late
}
```

### 3. Don't Use for Control Flow

```typescript
// ✅ Good - assertions for invariants
function process(data: Data | null) {
  if (data === null) {
    return // Normal flow
  }
  processData(data)
}

// ❌ Avoid - assertions for control flow
function process(data: Data | null) {
  assert(data !== null, 'No data') // Don't use for expected conditions
  processData(data)
}
```

### 4. Remove in Production (Optional)

```typescript
// Development assertions
if (process.env.NODE_ENV !== 'production') {
  assert(invariant, 'Invariant violated')
}

// Or use a build tool to strip assertions
```

## When to Use Assertions

### Use Assertions For:
- **Invariants** - Conditions that should never be violated
- **Preconditions** - Requirements at function entry
- **Postconditions** - Guarantees at function exit
- **Development** - Catching bugs during development
- **Documentation** - Self-documenting code assumptions

### Don't Use Assertions For:
- **Expected errors** - User input validation
- **Control flow** - Normal program logic
- **External failures** - Network errors, file not found
- **Recoverable errors** - Errors with fallback strategies

## Comparison with Alternatives

### vs console.assert()

```typescript
// console.assert - only logs in console
console.assert(condition, 'message') // Doesn't throw

// assert - throws AssertionError
assert(condition, 'message') // Throws
```

### vs if/throw

```typescript
// if/throw - verbose
if (!condition) {
  throw new Error('message')
}

// assert - concise
assert(condition, 'message')
```

### vs type-guards

```typescript
// type-guards - runtime + type narrowing
import { asString } from '@sky-modules/core/type-guards'

asString(value) // Throws and narrows type

// assert - runtime only
assert(typeof value === 'string', 'must be string')
```

## Error Handling

```typescript
try {
  assert(condition, 'Condition failed')
} catch (error) {
  if (error instanceof AssertionError) {
    console.error('Assertion failed:', error.message)
    // Handle assertion failure
  }
}
```

## Production Builds

Assertions can be stripped in production for performance:

```javascript
// Babel plugin example
{
  "plugins": [
    ["transform-remove-console", {
      "exclude": ["error", "warn"]
    }],
    ["transform-remove-assertions"]
  ]
}
```

Or use conditional compilation:

```typescript
const assert = process.env.NODE_ENV === 'production'
  ? () => {} // No-op in production
  : (expr: unknown, msg: string) => {
      if (!expr) throw new AssertionError(msg)
    }
```

## Related Modules

- [core/type-guards](../type-guards/) - Type checking and assertions
- [core/assume](../assume/) - Type assumptions
- [core/errors](../errors/) - Error utilities

## Examples

See [assert.spec.ts](./assert.spec.ts) for comprehensive usage examples and test cases.
