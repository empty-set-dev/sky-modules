# transform

Chainable transform system for converting values between formats.

## Installation

```typescript
import { transform, defineTransform, to, from } from '@sky-modules/core/transform'
```

## API

### defineTransform(type, toFn, fromFn)

Register a new transformation format.

```typescript
defineTransform<To, From, A extends unknown[]>(
  type: string,
  toFn: (value: From, ...args: A) => To,
  fromFn: (value: To, ...args: A) => From
): void
```

**Parameters:**
- `type` - Name of the transformation format
- `toFn` - Function to convert from original format to target format
- `fromFn` - Function to convert back from target format to original

### transform.transform()

Apply registered transformations in order.

```typescript
transform.transform(value: unknown): unknown
```

**Parameters:**
- `value` - Value to transform

**Returns:** Transformed value

### transform.untransform()

Reverse all transformations in reverse order.

```typescript
transform.untransform(value: unknown): unknown
```

**Parameters:**
- `value` - Value to untransform

**Returns:** Original value

## Built-in Transformations

- **json** - Convert to/from JSON strings
- **base64** - Encode/decode Base64 strings

## Usage

### JSON Transformation

```typescript
const json = transform.json.transform({ name: 'John' })
console.log(json) // '{"name":"John"}'

const obj = transform.json.untransform(json)
console.log(obj) // { name: 'John' }
```

### Base64 Encoding

```typescript
const encoded = transform.base64.transform('Hello World')
console.log(encoded) // 'SGVsbG8gV29ybGQ='

const decoded = transform.base64.untransform(encoded)
console.log(decoded) // 'Hello World'
```

### Custom Transformation

```typescript
defineTransform('uppercase',
  (value: string) => value.toUpperCase(),
  (value: string) => value.toLowerCase()
)

const upper = transform.uppercase.transform('hello')
console.log(upper) // 'HELLO'

const lower = transform.uppercase.untransform(upper)
console.log(lower) // 'hello'
```
