# Canvas Geometries

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  geometries utility module
</div>

<PlaygroundLink id="canvas" label="Open Canvas Playground" />


Shape definitions for Canvas rendering. Geometries define **what** to draw on the canvas.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { geometries } from '@sky-modules/core'
```

## Overview

Geometries are classes that define shapes to be rendered. They implement the `draw` method that adds paths to the canvas context. Geometries are combined with Materials in a Mesh for rendering.

**Key Concepts:**
- Geometry defines the **shape** (what to draw)
- Material defines the **style** (how to draw)
- Mesh combines both for rendering
- All coordinates auto-scale by `devicePixelRatio`

## Base Class

### Geometry

**File:** `Geometry.ts`

Abstract base class for all geometries.

**Interface:**
```typescript
abstract class Geometry {
  abstract draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void
}
```

**Implementation Requirements:**
- Must implement `draw` method
- Add paths to canvas context (do NOT fill/stroke)
- Scale all coordinates by `pixelRatio`
- Support cloning

## Built-in Geometries

### RectGeometry

**File:** `RectGeometry.ts`

Rectangular shape geometry.

**Properties:**
- `width: number` - Rectangle width
- `height: number` - Rectangle height
- `x: number` - X offset from origin (default: 0)
- `y: number` - Y offset from origin (default: 0)

**Usage:**
```typescript
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'

// Basic rectangle
const rect = new RectGeometry({ width: 100, height: 50 })

// Rectangle with offset
const rect2 = new RectGeometry({
  width: 100,
  height: 50,
  x: -50,  // Center horizontally
  y: -25   // Center vertically
})
```

**JSX:**
```tsx
<Mesh position={[200, 100]}>
  <RectGeometry width={100} height={50} />
  <BasicMaterial color="#ff0000" />
</Mesh>
```

**Defaults:**
```typescript
{
  width: 1,
  height: 1,
  x: 0,
  y: 0
}
```

### CircleGeometry

**File:** `CircleGeometry.ts`

Circle or arc geometry.

**Properties:**
- `radius: number` - Circle radius
- `x: number` - X offset from origin (default: 0)
- `y: number` - Y offset from origin (default: 0)
- `startAngle: number` - Start angle in radians (default: 0)
- `endAngle: number` - End angle in radians (default: 2π)
- `counterclockwise: boolean` - Draw direction (default: false)

**Usage:**
```typescript
import { CircleGeometry } from '@sky-modules/canvas/geometries/CircleGeometry'

// Full circle
const circle = new CircleGeometry({ radius: 50 })

// Half circle (arc)
const arc = new CircleGeometry({
  radius: 50,
  startAngle: 0,
  endAngle: Math.PI
})

// Pac-Man
const pacman = new CircleGeometry({
  radius: 50,
  startAngle: Math.PI * 0.25,
  endAngle: Math.PI * 1.75
})
```

**JSX:**
```tsx
<Mesh position={[200, 100]}>
  <CircleGeometry radius={50} />
  <BasicMaterial color="#00ff00" />
</Mesh>
```

**Defaults:**
```typescript
{
  radius: 1,
  x: 0,
  y: 0,
  startAngle: 0,
  endAngle: Math.PI * 2,
  counterclockwise: false
}
```

### EllipseGeometry

**File:** `EllipseGeometry.ts`

Elliptical shape geometry.

**Properties:**
- `radiusX: number` - Horizontal radius
- `radiusY: number` - Vertical radius
- `x: number` - X offset from origin (default: 0)
- `y: number` - Y offset from origin (default: 0)
- `rotation: number` - Rotation in radians (default: 0)
- `startAngle: number` - Start angle (default: 0)
- `endAngle: number` - End angle (default: 2π)
- `counterclockwise: boolean` - Draw direction (default: false)

**Usage:**
```typescript
import { EllipseGeometry } from '@sky-modules/canvas/geometries/EllipseGeometry'

// Horizontal ellipse
const ellipse = new EllipseGeometry({
  radiusX: 100,
  radiusY: 50
})

// Rotated ellipse
const rotated = new EllipseGeometry({
  radiusX: 100,
  radiusY: 50,
  rotation: Math.PI / 4
})
```

**JSX:**
```tsx
<Mesh position={[200, 100]}>
  <EllipseGeometry radiusX={100} radiusY={50} />
  <BasicMaterial color="#0000ff" />
</Mesh>
```

### TextGeometry

**File:** `TextGeometry.ts`

Text rendering geometry.

**Properties:**
- `text: string` - Text content
- `x: number` - X position (default: 0)
- `y: number` - Y position (default: 0)
- `font: string` - Full font string
- `fontSize: number` - Font size in pixels (default: 16)
- `fontFamily: string` - Font family (default: 'sans-serif')
- `fontWeight: string | number` - Font weight (default: 'normal')
- `fontStyle: string` - Font style (default: 'normal')
- `textAlign: CanvasTextAlign` - Horizontal alignment (default: 'left')
- `textBaseline: CanvasTextBaseline` - Vertical alignment (default: 'top')
- `maxWidth?: number` - Maximum text width (optional)

**Usage:**
```typescript
import { TextGeometry } from '@sky-modules/canvas/geometries/TextGeometry'

// Basic text
const text = new TextGeometry({
  text: 'Hello World',
  fontSize: 24
})

// Styled text
const styled = new TextGeometry({
  text: 'Styled Text',
  fontSize: 32,
  fontFamily: 'Arial',
  fontWeight: 'bold',
  fontStyle: 'italic',
  textAlign: 'center'
})

// Custom font string
const custom = new TextGeometry({
  text: 'Custom',
  font: 'italic bold 24px Georgia'
})
```

**JSX:**
```tsx
<Mesh position={[100, 100]}>
  <TextGeometry
    text="Hello World"
    fontSize={24}
    fontWeight="bold"
  />
  <BasicMaterial color="#ffffff" />
</Mesh>
```

**Text Alignment:**
```typescript
// Horizontal: 'left' | 'right' | 'center' | 'start' | 'end'
// Vertical: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'

const centered = new TextGeometry({
  text: 'Centered',
  textAlign: 'center',
  textBaseline: 'middle'
})
```

**Note:** TextGeometry uses a special rendering approach. It stores text data in the canvas context for Materials to render.

### PathGeometry

**File:** `PathGeometry.ts`

Custom path geometry with fluent API for building complex shapes.

**Features:**
- Fluent API for path building
- Support for all canvas path operations
- Method chaining

**Path Commands:**
- `moveTo(x, y)` - Move pen to position
- `lineTo(x, y)` - Draw line to position
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Cubic Bezier curve
- `quadraticCurveTo(cpx, cpy, x, y)` - Quadratic curve
- `arcTo(x1, y1, x2, y2, radius)` - Arc between points
- `arc(x, y, radius, start, end, ccw?)` - Arc
- `closePath()` - Close current path

**Usage:**
```typescript
import { PathGeometry } from '@sky-modules/canvas/geometries/PathGeometry'

// Custom shape
const path = new PathGeometry()
  .moveTo(50, 0)
  .lineTo(100, 50)
  .lineTo(50, 100)
  .lineTo(0, 50)
  .closePath()

// Bezier curve
const curve = new PathGeometry()
  .moveTo(0, 0)
  .bezierCurveTo(25, -50, 75, 50, 100, 0)

// Heart shape
const heart = new PathGeometry()
  .moveTo(50, 30)
  .bezierCurveTo(50, 20, 40, 5, 25, 5)
  .bezierCurveTo(10, 5, 0, 15, 0, 30)
  .bezierCurveTo(0, 45, 10, 55, 25, 65)
  .lineTo(50, 85)
  .lineTo(75, 65)
  .bezierCurveTo(90, 55, 100, 45, 100, 30)
  .bezierCurveTo(100, 15, 90, 5, 75, 5)
  .bezierCurveTo(60, 5, 50, 20, 50, 30)
  .closePath()
```

**JSX:**
```tsx
<Mesh>
  <PathGeometry
    ref={(path) => {
      path
        .moveTo(0, 0)
        .lineTo(100, 0)
        .lineTo(50, 100)
        .closePath()
    }}
  />
  <BasicMaterial color="#ff00ff" />
</Mesh>
```

### PolylineGeometry

**File:** `PolylineGeometry.ts`

Multi-point line or polygon geometry.

**Properties:**
- `points: Point[]` - Array of {x, y} points
- `closed: boolean` - Whether to close the path (default: true)

**Methods:**
- `addPoint(x, y)` - Add single point
- `addPoints(...points)` - Add multiple points
- `setPoints(points)` - Replace all points
- `setClosed(closed)` - Set closed state

**Static Factory Methods:**
- `createRegularPolygon(centerX, centerY, radius, sides, rotation?)` - Regular polygon
- `createTriangle(x1, y1, x2, y2, x3, y3)` - Triangle
- `createStar(centerX, centerY, outerRadius, innerRadius, points?, rotation?)` - Star
- `createPath(points)` - Open path
- `createLine(x1, y1, x2, y2)` - Simple line
- `createPolyline(points)` - Open polyline
- `createPolygon(points)` - Closed polygon

**Usage:**
```typescript
import { PolylineGeometry } from '@sky-modules/canvas/geometries/PolylineGeometry'

// Custom polygon
const polygon = new PolylineGeometry({
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 50 },
    { x: 0, y: 50 }
  ],
  closed: true
})

// Open polyline
const line = new PolylineGeometry({
  points: [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 100, y: 0 }
  ],
  closed: false
})

// Regular pentagon
const pentagon = PolylineGeometry.createRegularPolygon(0, 0, 50, 5)

// Star
const star = PolylineGeometry.createStar(0, 0, 50, 25, 5)

// Triangle
const triangle = PolylineGeometry.createTriangle(0, 0, 100, 0, 50, 100)

// Line
const simpleLine = PolylineGeometry.createLine(0, 0, 100, 100)
```

**JSX:**
```tsx
<Mesh>
  <PolylineGeometry
    points={[
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 100 }
    ]}
    closed={true}
  />
  <StrokeMaterial color="#ffff00" lineWidth={2} />
</Mesh>
```

**Fluent API:**
```typescript
const custom = new PolylineGeometry()
  .addPoint(0, 0)
  .addPoint(100, 0)
  .addPoint(100, 100)
  .addPoint(0, 100)
  .setClosed(true)
```

### SplineGeometry

**File:** `SplineGeometry.ts`

Smooth curve through points using Catmull-Rom splines.

**Properties:**
- `points: Point[]` - Control points
- `tension: number` - Curve tension (0-1, default: 0.5)
- `closed: boolean` - Whether to close the curve (default: false)

**Usage:**
```typescript
import { SplineGeometry } from '@sky-modules/canvas/geometries/SplineGeometry'

// Smooth curve
const spline = new SplineGeometry({
  points: [
    { x: 0, y: 50 },
    { x: 50, y: 0 },
    { x: 100, y: 50 },
    { x: 150, y: 100 }
  ],
  tension: 0.5
})

// Closed spline
const closedSpline = new SplineGeometry({
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ],
  closed: true,
  tension: 0.3
})
```

**JSX:**
```tsx
<Mesh>
  <SplineGeometry
    points={[
      { x: 0, y: 0 },
      { x: 50, y: -50 },
      { x: 100, y: 0 },
      { x: 150, y: 50 }
    ]}
    tension={0.5}
  />
  <StrokeMaterial color="#00ffff" lineWidth={2} />
</Mesh>
```

**Tension Parameter:**
- `0` - Sharp corners (like PolylineGeometry)
- `0.5` - Natural smooth curve (default)
- `1` - Very smooth, overshoots points

## Common Patterns

### Centering Geometries

Use `x` and `y` properties to center shapes around their origin:

```typescript
// Rectangle centered at mesh position
const centered = new RectGeometry({
  width: 100,
  height: 50,
  x: -50,  // Half width
  y: -25   // Half height
})

// Circle is already centered
const circle = new CircleGeometry({ radius: 50 })
```

### Combining with Materials

Geometries are always used with Materials in a Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
```

### Reactive Updates

In Canvas JSX, geometry properties can be reactive:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [radius, setRadius] = createSignal(50)

  return (
    <Mesh>
      <CircleGeometry radius={radius()} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  )
}
```

### Cloning Geometries

All geometries support cloning:

```typescript
const original = new RectGeometry({ width: 100, height: 50 })
const cloned = original.clone()

// Modify clone without affecting original
cloned.width = 200
```

## Pixel Ratio Scaling

All geometry coordinates automatically scale by `devicePixelRatio` for crisp rendering on high-DPI displays:

```typescript
// User code (logical pixels)
const rect = new RectGeometry({ width: 100, height: 50 })

// Internal draw (physical pixels on 2x display)
// ctx.rect(0 * 2, 0 * 2, 100 * 2, 50 * 2)
```

**What gets scaled:**
- All position coordinates (x, y)
- All dimension values (width, height, radius)
- All curve control points

**What doesn't get scaled:**
- Angles (radians)
- Boolean flags
- String values

## Creating Custom Geometries

Extend the `Geometry` base class:

```typescript
import { Geometry } from '@sky-modules/canvas/geometries/Geometry'

export interface CustomGeometryProps {
  size?: number
}

export class CustomGeometry extends Geometry {
  public size: number

  constructor(props: CustomGeometryProps = {}) {
    super()
    this.size = props.size ?? 100
  }

  draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    // Draw custom shape
    const s = this.size * pixelRatio

    ctx.moveTo(0, 0)
    ctx.lineTo(s, 0)
    ctx.lineTo(s / 2, s)
    ctx.closePath()
  }

  clone(): CustomGeometry {
    return new CustomGeometry({ size: this.size })
  }
}
```

**Guidelines:**
1. Extend `Geometry` base class
2. Add typed properties interface
3. Initialize all properties in constructor with defaults
4. Implement `draw` method
5. Scale all coordinates by `pixelRatio`
6. Do NOT call `fill()` or `stroke()` in `draw`
7. Implement `clone()` method
8. Export both interface and class

## Performance Tips

### Geometry Reuse

Geometries can be shared across multiple meshes:

```typescript
const geometry = new RectGeometry({ width: 100, height: 50 })

const mesh1 = new Mesh(geometry, material1)
const mesh2 = new Mesh(geometry, material2)
// Both use same geometry instance
```

### Static vs Dynamic

For static shapes, create geometry once:

```typescript
// Good - created once
const geometry = new CircleGeometry({ radius: 50 })

function render() {
  mesh.geometry = geometry
}
```

```typescript
// Bad - creates new instance every frame
function render() {
  mesh.geometry = new CircleGeometry({ radius: 50 })
}
```

### Path Complexity

Simpler paths render faster:

```typescript
// Fast
const simple = new RectGeometry({ width: 100, height: 50 })

// Slower
const complex = new PolylineGeometry({
  points: Array.from({ length: 1000 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.1) * 50
  }))
})
```

## Integration Points

### Canvas JSX

Geometries are JSX components:

```tsx
<CircleGeometry radius={50} />
<RectGeometry width={100} height={50} />
<TextGeometry text="Hello" fontSize={24} />
```

### Materials

Geometries work with any Material:

```typescript
// Same geometry, different materials
const geometry = new CircleGeometry({ radius: 50 })

const filled = new Mesh(geometry, new BasicMaterial({ color: '#ff0000' }))
const outlined = new Mesh(geometry, new StrokeMaterial({ color: '#00ff00', lineWidth: 2 }))
const gradient = new Mesh(geometry, new GradientMaterial({ /* ... */ }))
```

### Mesh

Geometries are always rendered through Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'

const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)
scene.add(mesh)
```

## Related Documentation

- [Canvas Core README](../core/README.md) - Core rendering classes
- [Canvas Materials](../materials/) - Material classes
- [Canvas JSX README](../jsx/README.md) - JSX system

## Examples

### Basic Shapes

```typescript
// Rectangle
const rect = new RectGeometry({ width: 100, height: 50 })

// Circle
const circle = new CircleGeometry({ radius: 50 })

// Triangle using PolylineGeometry
const triangle = PolylineGeometry.createTriangle(0, 0, 100, 0, 50, 100)

// Star
const star = PolylineGeometry.createStar(0, 0, 50, 25, 5)
```

### Complex Shapes

```typescript
// Custom path
const arrow = new PathGeometry()
  .moveTo(0, 20)
  .lineTo(60, 20)
  .lineTo(60, 0)
  .lineTo(100, 30)
  .lineTo(60, 60)
  .lineTo(60, 40)
  .lineTo(0, 40)
  .closePath()

// Smooth curve
const wave = new SplineGeometry({
  points: Array.from({ length: 10 }, (_, i) => ({
    x: i * 20,
    y: Math.sin(i * 0.5) * 30
  })),
  tension: 0.5
})
```

### Text Rendering

```typescript
// Simple text
const text = new TextGeometry({
  text: 'Hello World',
  fontSize: 32
})

// Multiline (use multiple TextGeometry instances)
const line1 = new TextGeometry({
  text: 'Line 1',
  fontSize: 24,
  y: 0
})

const line2 = new TextGeometry({
  text: 'Line 2',
  fontSize: 24,
  y: 30
})
```

### Animated Shapes

```tsx
import { createSignal } from 'solid-js'

function AnimatedCircle() {
  const [radius, setRadius] = createSignal(50)

  setInterval(() => {
    setRadius(r => r + Math.sin(Date.now() / 1000) * 2)
  }, 16)

  return (
    <Mesh>
      <CircleGeometry radius={radius()} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  )
}
```
