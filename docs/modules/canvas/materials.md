# Canvas Materials

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  materials utility module
</div>

<PlaygroundLink id="canvas" label="Open Canvas Playground" />


Drawing style definitions for Canvas rendering. Materials define **how** to draw shapes on the canvas.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { materials } from '@sky-modules/core'
```

## Overview

Materials are classes that define drawing styles for geometries. They implement the `apply` and `render` methods that configure canvas context and execute drawing operations. Materials are combined with Geometries in a Mesh for rendering.

**Key Concepts:**
- Material defines the **style** (how to draw)
- Geometry defines the **shape** (what to draw)
- Mesh combines both for rendering
- All dimensions auto-scale by `devicePixelRatio`

## Base Class

### Material

**File:** `Material.ts`

Abstract base class for all materials with common styling properties.

**Common Properties:**
- `color: string` - Base color (CSS color string)
- `opacity: number` - Global opacity (0-1, default: 1)
- `lineWidth: number` - Line thickness (default: 1)
- `lineCap: CanvasLineCap` - Line cap style (default: 'butt')
- `lineJoin: CanvasLineJoin` - Line join style (default: 'miter')
- `lineDash: number[]` - Dash pattern (default: [])
- `lineDashOffset: number` - Dash offset (default: 0)
- `shadowBlur: number` - Shadow blur radius (default: 0)
- `shadowColor: string` - Shadow color (default: 'transparent')
- `shadowOffsetX: number` - Shadow X offset (default: 0)
- `shadowOffsetY: number` - Shadow Y offset (default: 0)
- `globalCompositeOperation: GlobalCompositeOperation` - Composite mode (default: 'source-over')

**Methods:**
```typescript
abstract class Material {
  constructor(parameters: MaterialParameters)
  apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void
  abstract render(ctx: CanvasRenderingContext2D): void
}
```

**Implementation Requirements:**
- Extend `Material` base class
- Override `apply` method to set fillStyle/strokeStyle
- Override `render` method to execute fill/stroke operations
- Implement `clone` method for copying
- Auto-scale dimensions by `pixelRatio`

## Built-in Materials

### BasicMaterial

**File:** `BasicMaterial.ts`

Solid color fill material.

**Usage:**
```typescript
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

// Simple fill
const material = new BasicMaterial({ color: '#ff0000' })

// With opacity
const transparent = new BasicMaterial({
  color: '#ff0000',
  opacity: 0.5
})

// With shadow
const shadowed = new BasicMaterial({
  color: '#0000ff',
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowOffsetX: 5,
  shadowOffsetY: 5
})
```

**JSX:**
```tsx
<Mesh>
  <CircleGeometry radius={50} />
  <BasicMaterial color="#ff0000" opacity={0.8} />
</Mesh>
```

**Properties:**
- All base Material properties
- Uses `color` for fill

**Features:**
- Solid color filling
- Text rendering support (via TextGeometry)
- Word wrapping for text with maxWidth

**Defaults:**
```typescript
{
  color: '#ffffff',
  opacity: 1
}
```

### StrokeMaterial

**File:** `StrokeMaterial.ts`

Outline/stroke material.

**Usage:**
```typescript
import { StrokeMaterial } from '@sky-modules/canvas/materials/StrokeMaterial'

// Simple stroke
const material = new StrokeMaterial({
  color: '#000000',
  lineWidth: 2
})

// Dashed line
const dashed = new StrokeMaterial({
  color: '#ff0000',
  lineWidth: 3,
  lineDash: [10, 5]
})

// Rounded corners
const rounded = new StrokeMaterial({
  color: '#00ff00',
  lineWidth: 4,
  lineCap: 'round',
  lineJoin: 'round'
})
```

**JSX:**
```tsx
<Mesh>
  <RectGeometry width={100} height={50} />
  <StrokeMaterial
    color="#000000"
    lineWidth={2}
    lineCap="round"
  />
</Mesh>
```

**Properties:**
- All base Material properties
- Uses `color` for stroke
- `lineWidth` controls thickness
- `lineCap`: 'butt' | 'round' | 'square'
- `lineJoin`: 'miter' | 'round' | 'bevel'
- `lineDash`: Array of dash/gap lengths

**Line Cap Styles:**
```typescript
// Flat ends
lineCap: 'butt'

// Rounded ends
lineCap: 'round'

// Square ends (extends beyond line)
lineCap: 'square'
```

**Line Join Styles:**
```typescript
// Sharp corners
lineJoin: 'miter'

// Rounded corners
lineJoin: 'round'

// Beveled corners
lineJoin: 'bevel'
```

**Defaults:**
```typescript
{
  color: '#000000',  // Black stroke
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter'
}
```

### GradientMaterial

**File:** `GradientMaterial.ts`

Gradient fill material using CanvasGradient.

**Usage:**
```typescript
import { GradientMaterial } from '@sky-modules/canvas/materials/GradientMaterial'
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'

const canvas = new CanvasRenderer()

// Linear gradient
const linearGradient = canvas.createLinearGradient(0, 0, 100, 0)
linearGradient.addColorStop(0, '#ff0000')
linearGradient.addColorStop(1, '#0000ff')

const material = new GradientMaterial({ gradient: linearGradient })

// Radial gradient
const radialGradient = canvas.createRadialGradient(50, 50, 0, 50, 50, 50)
radialGradient.addColorStop(0, '#ffffff')
radialGradient.addColorStop(1, '#000000')

const radial = new GradientMaterial({ gradient: radialGradient })

// Conic gradient
const conicGradient = canvas.createConicGradient(0, 50, 50)
conicGradient.addColorStop(0, '#ff0000')
conicGradient.addColorStop(0.33, '#00ff00')
conicGradient.addColorStop(0.67, '#0000ff')
conicGradient.addColorStop(1, '#ff0000')

const conic = new GradientMaterial({ gradient: conicGradient })
```

**JSX:**
```tsx
function GradientCircle({ canvas }) {
  const gradient = canvas.createLinearGradient(0, 0, 100, 0)
  gradient.addColorStop(0, '#ff0000')
  gradient.addColorStop(1, '#0000ff')

  return (
    <Mesh>
      <CircleGeometry radius={50} />
      <GradientMaterial gradient={gradient} />
    </Mesh>
  )
}
```

**Properties:**
- All base Material properties
- `gradient: CanvasGradient` - Required gradient object

**Gradient Types:**
- **Linear**: `createLinearGradient(x0, y0, x1, y1)`
- **Radial**: `createRadialGradient(x0, y0, r0, x1, y1, r1)`
- **Conic**: `createConicGradient(angle, x, y)`

**Creating Gradients:**
```typescript
// Get canvas renderer
const canvas = new CanvasRenderer()

// Linear gradient (left to right)
const linear = canvas.createLinearGradient(0, 0, 100, 0)
linear.addColorStop(0, 'red')
linear.addColorStop(0.5, 'yellow')
linear.addColorStop(1, 'green')

// Radial gradient (center outward)
const radial = canvas.createRadialGradient(50, 50, 0, 50, 50, 50)
radial.addColorStop(0, 'white')
radial.addColorStop(1, 'black')

// Conic gradient (rotating hue)
const conic = canvas.createConicGradient(0, 50, 50)
for (let i = 0; i <= 1; i += 0.1) {
  const hue = i * 360
  conic.addColorStop(i, `hsl(${hue}, 100%, 50%)`)
}
```

### StrokeGradientMaterial

**File:** `StrokeGradientMaterial.ts`

Gradient stroke/outline material.

**Usage:**
```typescript
import { StrokeGradientMaterial } from '@sky-modules/canvas/materials/StrokeGradientMaterial'

const gradient = canvas.createLinearGradient(0, 0, 100, 0)
gradient.addColorStop(0, '#ff0000')
gradient.addColorStop(1, '#0000ff')

const material = new StrokeGradientMaterial({
  gradient,
  lineWidth: 4
})
```

**JSX:**
```tsx
function GradientOutline({ canvas }) {
  const gradient = canvas.createLinearGradient(0, 0, 100, 100)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1, 'blue')

  return (
    <Mesh>
      <RectGeometry width={100} height={100} />
      <StrokeGradientMaterial
        gradient={gradient}
        lineWidth={3}
      />
    </Mesh>
  )
}
```

**Properties:**
- All base Material properties
- `gradient: CanvasGradient` - Required gradient object
- Uses gradient for stroke color

### FillStrokeMaterial

**File:** `FillStrokeMaterial.ts`

Combined fill and stroke material.

**Usage:**
```typescript
import { FillStrokeMaterial } from '@sky-modules/canvas/materials/FillStrokeMaterial'

// Fill and stroke with same color
const material = new FillStrokeMaterial({
  color: '#ff0000',
  lineWidth: 2
})

// Different fill and stroke colors
const outlined = new FillStrokeMaterial({
  color: '#ffff00',        // Fill color
  strokeColor: '#000000',  // Stroke color
  lineWidth: 3
})
```

**JSX:**
```tsx
<Mesh>
  <CircleGeometry radius={50} />
  <FillStrokeMaterial
    color="#ffff00"
    strokeColor="#000000"
    lineWidth={2}
  />
</Mesh>
```

**Properties:**
- All base Material properties
- `color` - Fill color
- `strokeColor` - Stroke color (defaults to `color` if not specified)

**Features:**
- Fills and strokes in one material
- Different colors for fill and stroke
- All stroke properties (lineWidth, lineCap, etc.)

### PatternMaterial

**File:** `PatternMaterial.ts`

Repeating pattern fill material.

**Usage:**
```typescript
import { PatternMaterial } from '@sky-modules/canvas/materials/PatternMaterial'

// From image
const image = new Image()
image.src = '/texture.png'
await image.decode()

const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,
  rotation: Math.PI / 4,
  offsetX: 10,
  offsetY: 10
})

// From canvas pattern
const ctx = document.createElement('canvas').getContext('2d')!
const canvasPattern = ctx.createPattern(image, 'repeat')!

const material = new PatternMaterial({
  pattern: canvasPattern,
  scale: 1,
  rotation: 0
})
```

**JSX:**
```tsx
function TexturedMesh() {
  const [image, setImage] = createSignal<HTMLImageElement>()

  onMount(async () => {
    const img = new Image()
    img.src = '/texture.png'
    await img.decode()
    setImage(img)
  })

  return (
    <Show when={image()}>
      <Mesh>
        <RectGeometry width={200} height={200} />
        <PatternMaterial
          image={image()!}
          repetition="repeat"
          scale={0.5}
        />
      </Mesh>
    </Show>
  )
}
```

**Properties:**
- All base Material properties
- `pattern: CanvasPattern` - Canvas pattern object
- `image?: CanvasImageSource` - Image for pattern creation
- `repetition?: PatternRepetition` - 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
- `scale: number` - Pattern scale (default: 1)
- `rotation: number` - Pattern rotation in radians (default: 0)
- `offsetX: number` - Horizontal offset (default: 0)
- `offsetY: number` - Vertical offset (default: 0)

**Static Methods:**
```typescript
// Create from image with options
PatternMaterial.fromImage(
  image: CanvasImageSource,
  repetition?: PatternRepetition,
  options?: PatternMaterialParameters
): PatternMaterial
```

**Repetition Modes:**
```typescript
// Repeat in both directions
repetition: 'repeat'

// Repeat horizontally only
repetition: 'repeat-x'

// Repeat vertically only
repetition: 'repeat-y'

// No repetition
repetition: 'no-repeat'
```

**Transform Features:**
```typescript
const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,           // Half size
  rotation: Math.PI / 4, // 45 degrees
  offsetX: 20,          // Move right 20px
  offsetY: 10           // Move down 10px
})
```

**Performance:**
- Transform matrix is cached
- Only recalculates when transform properties change
- Efficient for animated patterns

## Common Properties

All materials share these properties from the base `Material` class:

### Color & Opacity

```typescript
// Solid color
{ color: '#ff0000' }

// RGB
{ color: 'rgb(255, 0, 0)' }

// RGBA
{ color: 'rgba(255, 0, 0, 0.5)' }

// HSL
{ color: 'hsl(0, 100%, 50%)' }

// Named colors
{ color: 'red' }

// Opacity (0-1)
{ opacity: 0.5 }
```

### Line Properties

```typescript
{
  lineWidth: 2,
  lineCap: 'round',    // 'butt' | 'round' | 'square'
  lineJoin: 'round',   // 'miter' | 'round' | 'bevel'
  lineDash: [10, 5],   // Dash and gap lengths
  lineDashOffset: 0    // Offset for animated dashes
}
```

### Shadow Properties

```typescript
{
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowOffsetX: 5,
  shadowOffsetY: 5
}
```

### Composite Operations

```typescript
{
  globalCompositeOperation: 'source-over'
}
```

**Common Composite Modes:**
- `'source-over'` - Normal (default)
- `'multiply'` - Multiply blend
- `'screen'` - Screen blend
- `'overlay'` - Overlay blend
- `'darken'` - Darken only
- `'lighten'` - Lighten only
- `'color-dodge'` - Dodge
- `'color-burn'` - Burn
- `'hard-light'` - Hard light
- `'soft-light'` - Soft light
- `'difference'` - Difference
- `'exclusion'` - Exclusion
- `'hue'` - Hue blend
- `'saturation'` - Saturation blend
- `'color'` - Color blend
- `'luminosity'` - Luminosity blend

## Common Patterns

### Combining with Geometries

Materials are always used with Geometries in a Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { CircleGeometry } from '@sky-modules/canvas/geometries/CircleGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
```

### Reactive Updates

In Canvas JSX, material properties can be reactive:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [color, setColor] = createSignal('#ff0000')

  return (
    <Mesh>
      <CircleGeometry radius={50} />
      <BasicMaterial color={color()} />
    </Mesh>
  )
}
```

### Cloning Materials

All materials support cloning:

```typescript
const original = new BasicMaterial({ color: '#ff0000', opacity: 0.5 })
const cloned = original.clone()

// Modify clone without affecting original
cloned.opacity = 1.0
```

### Animated Dashes

Animate dashed lines by updating `lineDashOffset`:

```tsx
function AnimatedDash() {
  const [offset, setOffset] = createSignal(0)

  setInterval(() => {
    setOffset(o => (o + 1) % 20)
  }, 50)

  return (
    <Mesh>
      <RectGeometry width={200} height={100} />
      <StrokeMaterial
        color="#000000"
        lineWidth={2}
        lineDash={[10, 10]}
        lineDashOffset={offset()}
      />
    </Mesh>
  )
}
```

## Pixel Ratio Scaling

Material dimensions automatically scale by `devicePixelRatio`:

```typescript
// User code (logical pixels)
const material = new StrokeMaterial({
  lineWidth: 2,
  shadowBlur: 5,
  lineDash: [10, 5]
})

// Internal apply (physical pixels on 2x display)
// ctx.lineWidth = 2 * 2 = 4
// ctx.shadowBlur = 5 * 2 = 10
// ctx.setLineDash([10 * 2, 5 * 2]) = [20, 10]
```

**What gets scaled:**
- `lineWidth`
- `lineDash` segments
- `lineDashOffset`
- `shadowBlur`
- `shadowOffsetX`
- `shadowOffsetY`

**What doesn't get scaled:**
- Colors
- Opacity
- Line cap/join styles
- Composite operations
- Gradients
- Patterns (transform separately)

## Creating Custom Materials

Extend the `Material` base class:

```typescript
import { Material, MaterialParameters } from '@sky-modules/canvas/materials/Material'

export interface CustomMaterialParameters extends MaterialParameters {
  customProperty?: number
}

export class CustomMaterial extends Material {
  customProperty: number

  constructor(parameters: CustomMaterialParameters = {}) {
    super(parameters)
    this.customProperty = parameters.customProperty ?? 100
  }

  apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    super.apply(ctx, pixelRatio)
    // Set fill/stroke style
    ctx.fillStyle = this.color
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Execute fill/stroke
    ctx.fill()
  }

  clone(): CustomMaterial {
    return new CustomMaterial({
      customProperty: this.customProperty,
      color: this.color,
      opacity: this.opacity,
      // ... copy all base properties
    })
  }
}
```

**Guidelines:**
1. Extend `Material` base class
2. Add typed properties interface extending `MaterialParameters`
3. Call `super(parameters)` in constructor
4. Override `apply` to set fillStyle/strokeStyle
5. Override `render` to execute fill/stroke
6. Call `super.apply(ctx, pixelRatio)` to apply base properties
7. Implement `clone` method copying all properties
8. Export both interface and class

## Performance Tips

### Material Reuse

Materials can be shared across multiple meshes:

```typescript
const material = new BasicMaterial({ color: '#ff0000' })

const mesh1 = new Mesh(geometry1, material)
const mesh2 = new Mesh(geometry2, material)
// Both use same material instance
```

### Conditional Property Setting

The base Material class only sets properties that differ from defaults:

```typescript
// Fast - no shadowBlur set
const simple = new BasicMaterial({ color: '#ff0000' })

// Slower - sets shadow properties
const shadowed = new BasicMaterial({
  color: '#ff0000',
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)'
})
```

### Gradient Caching

Create gradients once and reuse:

```typescript
// Good - created once
const gradient = canvas.createLinearGradient(0, 0, 100, 0)
gradient.addColorStop(0, 'red')
gradient.addColorStop(1, 'blue')

const material = new GradientMaterial({ gradient })

// Bad - creates new gradient every frame
function render() {
  const gradient = canvas.createLinearGradient(0, 0, 100, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1, 'blue')
  mesh.material = new GradientMaterial({ gradient })
}
```

### Pattern Transform Caching

PatternMaterial caches transform matrix:

```typescript
const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,
  rotation: 0
})

// First apply - creates matrix
pattern.apply(ctx, pixelRatio)

// Second apply - uses cached matrix (same transform)
pattern.apply(ctx, pixelRatio)

// Third apply - recalculates (transform changed)
pattern.scale = 1.0
pattern.apply(ctx, pixelRatio)
```

## Integration Points

### Canvas JSX

Materials are JSX components:

```tsx
<BasicMaterial color="#ff0000" />
<StrokeMaterial color="#000000" lineWidth={2} />
<GradientMaterial gradient={gradient} />
```

### Geometries

Materials work with any Geometry:

```typescript
// Same material, different geometries
const material = new BasicMaterial({ color: '#ff0000' })

const circle = new Mesh(new CircleGeometry({ radius: 50 }), material)
const rect = new Mesh(new RectGeometry({ width: 100, height: 50 }), material)
const star = new Mesh(PolylineGeometry.createStar(0, 0, 50, 25, 5), material)
```

### Mesh

Materials are always rendered through Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'

const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)
scene.add(mesh)
```

## Related Documentation

- [Canvas Core README](../core/README.md) - Core rendering classes
- [Canvas Geometries README](../geometries/README.md) - Geometry classes
- [Canvas JSX README](../jsx/README.md) - JSX system

## Examples

### Basic Shapes

```typescript
// Solid fill
const filled = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)

// Outlined
const outlined = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new StrokeMaterial({ color: '#000000', lineWidth: 2 })
)

// Fill and stroke
const both = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new FillStrokeMaterial({
    color: '#ffff00',
    strokeColor: '#000000',
    lineWidth: 3
  })
)
```

### Gradients

```typescript
const canvas = new CanvasRenderer()

// Rainbow gradient
const rainbow = canvas.createLinearGradient(0, 0, 200, 0)
rainbow.addColorStop(0, 'red')
rainbow.addColorStop(0.2, 'orange')
rainbow.addColorStop(0.4, 'yellow')
rainbow.addColorStop(0.6, 'green')
rainbow.addColorStop(0.8, 'blue')
rainbow.addColorStop(1, 'purple')

const mesh = new Mesh(
  new RectGeometry({ width: 200, height: 100 }),
  new GradientMaterial({ gradient: rainbow })
)

// Radial glow
const glow = canvas.createRadialGradient(0, 0, 0, 0, 0, 50)
glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
glow.addColorStop(1, 'rgba(255, 255, 255, 0)')

const glowMesh = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new GradientMaterial({ gradient: glow })
)
```

### Patterns

```typescript
// Load texture
const texture = new Image()
texture.src = '/brick.png'
await texture.decode()

// Create pattern
const brick = PatternMaterial.fromImage(texture, 'repeat', {
  scale: 0.5
})

const wall = new Mesh(
  new RectGeometry({ width: 400, height: 300 }),
  brick
)

// Animated pattern
function animatePattern() {
  brick.rotation += 0.01
  brick.offsetX += 0.5
  requestAnimationFrame(animatePattern)
}
animatePattern()
```

### Advanced Styling

```typescript
// Neon glow effect
const neon = new BasicMaterial({
  color: '#00ffff',
  shadowBlur: 20,
  shadowColor: '#00ffff',
  globalCompositeOperation: 'lighter'
})

// Dashed animated outline
const animated = new StrokeMaterial({
  color: '#ff0000',
  lineWidth: 3,
  lineDash: [15, 10],
  lineDashOffset: 0
})

setInterval(() => {
  animated.lineDashOffset = (animated.lineDashOffset + 1) % 25
}, 50)
```

### Text Styling

```tsx
<Mesh>
  <TextGeometry
    text="Hello World"
    fontSize={48}
    fontWeight="bold"
    textAlign="center"
  />
  <BasicMaterial
    color="#ffffff"
    shadowBlur={5}
    shadowColor="rgba(0, 0, 0, 0.8)"
    shadowOffsetY={2}
  />
</Mesh>
```
