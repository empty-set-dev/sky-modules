# Assert

Runtime assertion utilities for validating invariants.

## Installation

```typescript
import { assert, AssertionError } from '@sky-modules/core/assert'
```

## API

### assert(expression, message)

Assert that an expression is truthy.

```typescript
assert(expression: unknown, message: string): void
```

Throws `AssertionError` if expression is falsy.

### AssertionError

Custom error class for assertion failures.

```typescript
class AssertionError extends Error
```

## Usage

```typescript
function divide(a: number, b: number): number {
  assert(b !== 0, 'Divisor cannot be zero')
  return a / b
}

divide(10, 2)  // OK
divide(10, 0)  // AssertionError: assertion failed: Divisor cannot be zero
```

## Examples

### Preconditions

```typescript
function withdraw(amount: number) {
  assert(amount > 0, 'Amount must be positive')
  assert(amount <= balance, 'Insufficient funds')
  balance -= amount
}
```

### Array Validation

```typescript
function processItems(items: unknown) {
  assert(Array.isArray(items), 'Items must be an array')
  assert(items.length > 0, 'Items cannot be empty')
  items.forEach(processItem)
}
```

### Invariants

```typescript
class BankAccount {
  private balance = 0

  deposit(amount: number) {
    this.balance += amount
    assert(this.balance >= 0, 'Balance invariant violated')
  }
}
```

## When to Use

Use for:
- Invariants that should never be violated
- Preconditions at function entry
- Development-time bug detection

Don't use for:
- User input validation
- Expected errors
- Control flow
