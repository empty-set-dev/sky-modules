# Math Extensions

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Math utility module
</div>

Additional Math methods for common operations.

## Installation

```typescript
import '@sky-modules/core/Math'
```

## API

### Math.minmax(value, min, max)

Clamp a value between min and max bounds.

```typescript
Math.minmax(value: number, min: number, max: number): number
```

**Parameters:**
- `value` - Value to clamp
- `min` - Minimum bound
- `max` - Maximum bound

**Returns:** Clamped value between min and max

### Math.randomBetween(from, to)

Generate random number between two values.

```typescript
Math.randomBetween(from: number, to: number): number
```

**Parameters:**
- `from` - Lower bound (defaults to 0)
- `to` - Upper bound (defaults to 1)

**Returns:** Random float between from and to

### Math.roundedRandomBetween(from, to)

Generate random integer between two values.

```typescript
Math.roundedRandomBetween(from: number, to: number): number
```

**Parameters:**
- `from` - Lower bound (defaults to 0)
- `to` - Upper bound (defaults to 0)

**Returns:** Random integer between from and to (inclusive)

## Usage

### Clamping Values

```typescript
Math.minmax(150, 0, 100)    // 100
Math.minmax(-10, 0, 100)    // 0
Math.minmax(50, 0, 100)     // 50
```

### Random Numbers

```typescript
// Float between 0 and 1
Math.randomBetween()        // 0.7234...

// Float between 10 and 20
Math.randomBetween(10, 20)  // 15.432...

// Integer between 1 and 6 (dice)
Math.roundedRandomBetween(1, 6)  // 4
```

### Bounded Animation

```typescript
const velocity = Math.minmax(speed, -maxSpeed, maxSpeed)
const opacity = Math.minmax(value, 0, 1)
```
