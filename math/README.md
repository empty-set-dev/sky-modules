# math

Mathematical utilities and vector operations for 2D/3D graphics and scientific computing.

## Installation

```bash
npm install @sky-modules/math
```

## Features

- **Vector2** - 2D vector class with mathematical operations (from Three.js)
- **Vector3** - 3D vector class with mathematical operations (from Three.js)
- **Three.js Math Types** - Complete TypeScript definitions for Three.js math library
- **Global Extensions** - Optional global namespace pollution for convenience
- **Zero Dependencies** - Re-exports from Three.js math without additional overhead

## Usage

### Basic Vector Operations

```typescript
import { Vector2, Vector3 } from '@sky-modules/math'

// 2D vectors
const v2 = new Vector2(10, 20)
const v2_copy = v2.clone()
v2_copy.add(new Vector2(5, 5)) // (15, 25)

// 3D vectors
const v3 = new Vector3(1, 2, 3)
const length = v3.length() // ~3.74
const normalized = v3.clone().normalize() // Unit vector
```

### Vector Math

```typescript
import { Vector3 } from '@sky-modules/math'

const v1 = new Vector3(1, 0, 0)
const v2 = new Vector3(0, 1, 0)

// Dot product
const dot = v1.dot(v2) // 0

// Cross product
const cross = v1.clone().cross(v2) // (0, 0, 1)

// Distance between vectors
const distance = v1.distanceTo(v2) // ~1.41

// Linear interpolation
const lerp = v1.clone().lerp(v2, 0.5) // (0.5, 0.5, 0)
```

### Global Extensions

```typescript
// Import global extensions to use without imports
import '@sky-modules/math/global'

// Now Vector2 and Vector3 are globally available
const vec = new Vector2(10, 20)
const vec3 = new Vector3(1, 2, 3)
```

### Three.js Math Types

The module includes complete TypeScript definitions for all Three.js math classes:

```typescript
import type {
    Box2,
    Box3,
    Color,
    Euler,
    Matrix3,
    Matrix4,
    Quaternion,
    Sphere,
    Plane,
    Ray,
    // ... and more
} from '@sky-modules/math/three'
```

## API

### Vector2

**Source:** `@sky-modules/math/three/Vector2`

**Key Methods:**
- `new Vector2(x?, y?)` - Create 2D vector
- `add(v)` - Add vector
- `sub(v)` - Subtract vector
- `multiply(v)` - Multiply by vector
- `multiplyScalar(s)` - Multiply by scalar
- `divide(v)` - Divide by vector
- `divideScalar(s)` - Divide by scalar
- `dot(v)` - Dot product
- `cross(v)` - Cross product (returns scalar)
- `length()` - Vector magnitude
- `lengthSq()` - Squared magnitude (faster)
- `normalize()` - Convert to unit vector
- `distanceTo(v)` - Distance to another vector
- `distanceToSquared(v)` - Squared distance (faster)
- `lerp(v, alpha)` - Linear interpolation
- `clone()` - Create copy
- `equals(v)` - Equality check

### Vector3

**Source:** `@sky-modules/math/three/Vector3`

**Key Methods:**
- `new Vector3(x?, y?, z?)` - Create 3D vector
- `add(v)` - Add vector
- `sub(v)` - Subtract vector
- `multiply(v)` - Multiply by vector
- `multiplyScalar(s)` - Multiply by scalar
- `divide(v)` - Divide by vector
- `divideScalar(s)` - Divide by scalar
- `dot(v)` - Dot product
- `cross(v)` - Cross product (returns vector)
- `length()` - Vector magnitude
- `lengthSq()` - Squared magnitude (faster)
- `normalize()` - Convert to unit vector
- `distanceTo(v)` - Distance to another vector
- `distanceToSquared(v)` - Squared distance (faster)
- `lerp(v, alpha)` - Linear interpolation
- `applyMatrix3(m)` - Apply 3x3 matrix transformation
- `applyMatrix4(m)` - Apply 4x4 matrix transformation
- `applyQuaternion(q)` - Apply quaternion rotation
- `clone()` - Create copy
- `equals(v)` - Equality check

## Files

### Vector2/index.ts
**Purpose:** Re-exports Vector2 from Three.js math library
**Exports:** `Vector2` (default export)

### Vector2/global/Vector2.ts
**Purpose:** Global namespace extension for Vector2
**Features:**
- Makes Vector2 available globally without imports
- Uses globalify utility for safe global registration

### Vector3/index.ts
**Purpose:** Re-exports Vector3 from Three.js math library
**Exports:** `Vector3` (default export)

### Vector3/global/Vector3.ts
**Purpose:** Global namespace extension for Vector3
**Features:**
- Makes Vector3 available globally without imports
- Uses globalify utility for safe global registration

### three/*.d.ts
**Purpose:** TypeScript type definitions for Three.js math classes
**Key Exports:**
- `Box2`, `Box3` - Axis-aligned bounding boxes
- `Color` - RGB color with conversion utilities
- `Euler` - Euler angle rotation
- `Matrix2`, `Matrix3`, `Matrix4` - Matrix transformations
- `Quaternion` - Quaternion rotation
- `Sphere`, `Spherical` - Spherical coordinates and shapes
- `Plane` - Infinite plane
- `Ray` - Ray for raycasting
- `Triangle` - Triangle geometry
- `MathUtils` - Mathematical utility functions
- And more...

## Related Modules

- [@sky-modules/three](/three) - Three.js 3D rendering with JSX support
- [@sky-modules/canvas](/canvas) - 2D canvas rendering with vector support

## Implementation Notes

### Architecture

The module is a thin wrapper around Three.js math library:
1. **Vector2/Vector3** are direct re-exports from `three/src/math/`
2. **Type definitions** provide full TypeScript support
3. **Global extensions** use the `globalify` utility for safe namespace pollution
4. **Zero overhead** - no additional abstractions or transformations

### Why Three.js Math?

Three.js math classes are:
- Battle-tested in production 3D applications
- Highly optimized for performance
- Feature-complete with extensive operations
- Well-documented and maintained
- Compatible with WebGL and Canvas APIs

### Module Structure

```
math/
├── Vector2/
│   ├── index.ts              # Re-export from three
│   └── global/
│       ├── Vector2.ts        # Global extension
│       └── index.ts
├── Vector3/
│   ├── index.ts              # Re-export from three
│   └── global/
│       ├── Vector3.ts        # Global extension
│       └── index.ts
├── three/
│   ├── Vector2.d.ts          # Type definitions
│   ├── Vector3.d.ts
│   └── ...                   # Other math types
├── global/
│   └── index.ts              # All global extensions
└── index.ts                  # Main entry point
```

### Performance Considerations

1. **Use `lengthSq()` and `distanceToSquared()` when possible** - Avoids expensive sqrt() operation
2. **Reuse vectors** - Use `set()`, `copy()`, or modify in-place to avoid allocations
3. **Normalize sparingly** - Normalization involves division by length (sqrt + divide)
4. **Chain operations** - Methods return `this` for fluent API

### Best Practices

```typescript
// Good - reuse vectors
const temp = new Vector3()
for (const point of points) {
    temp.copy(point).normalize()
    // use temp...
}

// Bad - create many vectors
for (const point of points) {
    const normalized = point.clone().normalize()
    // use normalized...
}

// Good - use squared distance
if (v1.distanceToSquared(v2) < threshold * threshold) {
    // ...
}

// Bad - unnecessary sqrt
if (v1.distanceTo(v2) < threshold) {
    // ...
}
```
