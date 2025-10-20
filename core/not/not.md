# not

Type-safe null/undefined checking utilities with custom error types.

## Features

- Type-safe null, undefined, and nullish checks
- Custom error types for better error handling
- Assertion functions for type narrowing
- TypeScript's type guards support

## API

### Undefined Checks

#### `notUndefined<T>(value: undefined | T, message: string): T`

Returns the value if it's not undefined, otherwise throws `UndefinedError`.

```typescript
const value: string | undefined = getValue()
const result = notUndefined(value, 'Value must be defined')
// result is now typed as string
```

#### `assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T`

Asserts that value is not undefined using TypeScript's assertion signatures.

```typescript
const value: string | undefined = getValue()
assertIsNotUndefined(value, 'Value must be defined')
// value is now typed as string in the rest of the scope
```

#### `UndefinedError`

Custom error class for undefined values.

### Null Checks

#### `notNull<T>(value: null | T, message: string): T`

Returns the value if it's not null, otherwise throws `NullError`.

```typescript
const value: string | null = getValue()
const result = notNull(value, 'Value must not be null')
// result is now typed as string
```

#### `assertIsNotNull<T>(value: null | T, message: string): asserts value is T`

Asserts that value is not null using TypeScript's assertion signatures.

```typescript
const value: string | null = getValue()
assertIsNotNull(value, 'Value must not be null')
// value is now typed as string in the rest of the scope
```

#### `NullError`

Custom error class for null values.

### Nullish Checks

#### `notNullish<T>(value: undefined | null | T, message: string): T`

Returns the value if it's not nullish (null or undefined), otherwise throws `NullishError`.

```typescript
const value: string | null | undefined = getValue()
const result = notNullish(value, 'Value must be defined')
// result is now typed as string
```

#### `assertIsNotNullish<T>(value: undefined | null | T, message: string): asserts value is T`

Asserts that value is not nullish using TypeScript's assertion signatures.

```typescript
const value: string | null | undefined = getValue()
assertIsNotNullish(value, 'Value must be defined')
// value is now typed as string in the rest of the scope
```

#### `NullishError`

Custom error class for nullish values.

## Usage

Import the module:

```typescript
import '@sky-modules/core/not'
```

Or import individual functions:

```typescript
import { notUndefined, notNull, notNullish } from '@sky-modules/core/not'
```

## Error Messages

All errors include descriptive messages:

- `UndefinedError`: "unexpected undefined: [your message]"
- `NullError`: "unexpected null: [your message]"
- `NullishError`: "unexpected nullish: [your message]"
