# Define Measures

Define custom measurement units with conversion methods on Number prototype.

## Installation

```typescript
import defineMeasures from '@sky-modules/core/defineMeasures'
```

## API

### defineMeasures(name, measures)

Define a set of measurement units with automatic conversion methods.

```typescript
defineMeasures<T extends string, K extends string>(
  name: T,
  measures: [K, number][]
): void
```

**Parameters:**
- `name` - Measurement system name (used for error messages)
- `measures` - Array of `[unitName, conversionFactor]` tuples. The unit with factor `1` is the base unit

**Behavior:**
- Creates getter methods `as<Unit>` on Number.prototype for conversion
- Creates getter methods `in<Unit>` on Number.prototype for inverse conversion
- Throws error if no base unit (factor 1) is defined
- Throws error on measurement unit mismatch

**Returns:** void

## Usage

### Define Time Measurements

```typescript
defineMeasures('Time', [
  ['Nanoseconds', 0.000000001],
  ['Milliseconds', 0.001],
  ['Seconds', 1],              // Base unit
  ['Minutes', 60],
  ['Hours', 3600],
])

const duration = (5).seconds
console.log(duration.inMilliseconds)  // 5000
console.log(duration.inMinutes)       // 0.083...
```

### Define Length Measurements

```typescript
defineMeasures('Length', [
  ['Millimeters', 0.001],
  ['Meters', 1],               // Base unit
  ['Kilometers', 1000],
])

const distance = (100).meters
console.log(distance.inKilometers)   // 0.1
console.log(distance.inMillimeters)  // 100000
```

### Type-Safe Conversions

```typescript
const time1 = (1).seconds
const time2 = (1).minutes

// Convert both to seconds before adding
const total = (time1.inSeconds + time2.inSeconds).seconds
console.log(total.inSeconds)  // 61
```

## Notes

- Base unit (factor 1) is required
- Mixing units from different measurement systems throws an error
- Conversion factors are multiplicative from the base unit
