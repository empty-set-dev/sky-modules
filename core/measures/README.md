# Measures

Pre-defined measurement units with automatic conversion methods for common measurements.

## Installation

```typescript
import '@sky-modules/core/measures'
```

## API

Available measurement systems with conversion methods on Number prototype:

### Time

Convert between time units (nanoseconds to weeks).

```typescript
declare global {
  interface Number {
    asNanoseconds: Time
    asMilliseconds: Time
    asDeciseconds: Time
    asSeconds: Time
    asMinutes: Time
    asHours: Time
    asDays: Time
    asWeeks: Time
  }
  interface Time extends Number {
    inNanoseconds: number
    inMilliseconds: number
    inDeciseconds: number
    inSeconds: number
    inMinutes: number
    inHours: number
    inDays: number
    inWeeks: number
  }
}
```

### Length

Convert between length units (nanometers to kilometers).

```typescript
declare global {
  interface Number {
    asNanometers: Length
    asMillimeters: Length
    asDecimeters: Length
    asMeters: Length
    asKilometers: Length
  }
  interface Length extends Number {
    inNanometers: number
    inMillimeters: number
    inDecimeters: number
    inMeters: number
    inKilometers: number
  }
}
```

### Weight

Convert between weight units.

### Percents

Convert between percentage units.

### Velocity Units (Speed)

- KilometersPerHour
- MetersPerSecond

### Angular Velocity

- PercentsPerSecond
- PercentsPerMillisecond

## Usage

### Time Conversions

```typescript
import '@sky-modules/core/measures'

// Convert seconds to milliseconds
const duration = (5).asSeconds
console.log(duration.inMilliseconds)  // 5000

// Convert minutes to hours
const workDay = (8).asHours
console.log(workDay.inMinutes)        // 480

// Add different units
const total = (1).asMinutes.inSeconds + (30).asSeconds.inSeconds
console.log(total)  // 90
```

### Length Conversions

```typescript
// Convert meters to kilometers
const distance = (1000).asMeters
console.log(distance.inKilometers)    // 1

// Convert millimeters to decimeters
const width = (50).asMillimeters
console.log(width.inDecimeters)       // 0.5
```

### Speed Conversions

```typescript
// Convert kilometers per hour to meters per second
const speed = (100).asKilometersPerHour
// Convert if needed...

// Or work directly with velocity measures
```

### Combined Operations

```typescript
// Time calculation
const msPerFrame = (1000 / 60).asMilliseconds  // 60 FPS
console.log(msPerFrame.inSeconds)              // ~0.0167

// Length calculation
const boardSize = (200).asDecimeters  // 20 dm = 2 m
const boardSizeMeters = boardSize.inMeters     // 2

// Percentage calculation
const progress = (50).asPercent
console.log(progress)                          // 50
```

## Available Measurements

| Module | Base Unit | Available Conversions |
|--------|-----------|----------------------|
| Time | Seconds | ns, ms, deciseconds, s, min, h, days, weeks |
| Length | Meters | nm, mm, dm, m, km |
| Weight | Kilograms | (see implementation) |
| Percents | Percent | (see implementation) |
| KilometersPerHour | - | km/h to m/s conversions |
| MetersPerSecond | - | m/s to km/h conversions |

## Notes

- All measurement modules are imported automatically when importing measures
- Base units use factor 1 for conversions
- Type safety is enforced - mixing incompatible units throws an error
- Conversion methods return Number objects with measure metadata
- Useful for readable, type-safe physics and animation calculations
