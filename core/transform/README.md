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

### Data Encoding
- **json** - Convert to/from JSON strings (with Unicode support)
- **base64** - Encode/decode Base64 strings (with Unicode support)
- **base64url** - URL-safe Base64 encoding (no +/= characters)
- **hex** - Convert to/from hexadecimal representation
- **binary** - Convert to/from binary representation
- **url** - URL component encoding/decoding

### String Manipulation
- **upper** - Convert to uppercase (non-reversible)
- **lower** - Convert to lowercase (non-reversible)
- **reverse** - Reverse string characters

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
const encoded = transform.base64.transform('Hello World 🎉')
console.log(encoded) // Base64 encoded string

const decoded = transform.base64.untransform(encoded)
console.log(decoded) // 'Hello World 🎉'
```

### URL Encoding

```typescript
const encoded = transform.url.transform('Hello World!')
console.log(encoded) // 'Hello%20World!'

const decoded = transform.url.untransform(encoded)
console.log(decoded) // 'Hello World!'
```

### Hex Encoding

```typescript
const hex = transform.hex.transform('Hi')
console.log(hex) // '4869'

const text = transform.hex.untransform(hex)
console.log(text) // 'Hi'
```

### Binary Encoding

```typescript
const binary = transform.binary.transform('A')
console.log(binary) // '01000001'

const text = transform.binary.untransform(binary)
console.log(text) // 'A'
```

### URL-safe Base64

```typescript
const encoded = transform.base64url.transform('Test data')
// No +, /, or = characters - safe for URLs
const decoded = transform.base64url.untransform(encoded)
```

### Case Transformation

```typescript
// Note: These are non-reversible
const upper = to.upper('hello')  // 'HELLO'
const lower = to.lower('WORLD')  // 'world'
```

### String Reversal

```typescript
const reversed = transform.reverse.transform('Hello')
console.log(reversed) // 'olleH'

const original = transform.reverse.untransform(reversed)
console.log(original) // 'Hello'
```

### Chaining Transformations

```typescript
// Chain multiple transformations
const result = transform.json.base64.transform({ data: 'test' })

// Automatically untransform in reverse order
const original = transform.json.base64.untransform(result)

// Complex chains
const encoded = transform.hex.reverse.base64.transform('data')
const decoded = transform.hex.reverse.base64.untransform(encoded)
```

### Custom Transformation

```typescript
defineTransform('double',
  (value: number) => value * 2,
  (value: number) => value / 2
)

const result = to.double(5)  // 10
const original = from.double(result)  // 5
```
