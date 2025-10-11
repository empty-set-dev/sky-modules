# Canvas

A 2D rendering system for drawing shapes, text, and complex graphics with HTML5 Canvas API.

## Features

- **High-level drawing API** - Simplified methods for common drawing operations
- **Pixel ratio support** - Automatic scaling for high-DPI displays
- **Scene graph rendering** - Hierarchical object management
- **Material system** - Different rendering styles (fill, stroke, gradient, pattern)
- **Geometry system** - Reusable shape definitions
- **JSX support** - Declarative scene composition
- **Transform system** - Position, rotation, scale with world coordinates
- **Utility functions** - Extended drawing capabilities (hexagons, text measurement)

## Basic Usage

```typescript
import Canvas, { Scene, Mesh, RectGeometry, BasicMaterial } from '@sky-modules/Canvas'

// Create canvas
const canvas = new Canvas({
    size: () => [800, 600],
    pixelRatio: window.devicePixelRatio
})

// Create scene
const scene = new Scene()
scene.setBackground('#f0f0f0')

// Create a rectangle
const geometry = new RectGeometry(100, 50, 0, 0)
const material = new BasicMaterial({ color: '#ff0000' })
const mesh = new Mesh(geometry, material)

mesh.position.set(400, 300)
scene.add(mesh)

// Render
canvas.render(scene)
```

## Canvas API

### Constructor

```typescript
new Canvas(parameters: CanvasParameters)
```

**Parameters:**
- `size(): [number, number]` - Function returning canvas dimensions
- `canvas?: HTMLCanvasElement` - Optional existing canvas element
- `pixelRatio?: number` - Pixel ratio for high-DPI displays (default: `window.devicePixelRatio`)

### Drawing Methods

#### Path Operations
- `beginPath()` - Start a new path
- `closePath()` - Close current path
- `moveTo(x, y)` - Move to coordinates
- `lineTo(x, y)` - Draw line to coordinates
- `arcTo(x1, y1, x2, y2, radius)` - Draw arc between points
- `arc(x, y, radius, startAngle, endAngle, counterclockwise?)` - Draw circular arc
- `ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise?)` - Draw elliptical arc
- `quadraticCurveTo(cpx, cpy, x, y)` - Draw quadratic curve
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Draw cubic Bézier curve
- `rect(x, y, width, height)` - Add rectangle to path

#### Fill and Stroke
- `fill()` - Fill current path
- `stroke()` - Stroke current path
- `clip()` - Use current path as clipping region

#### Rectangles
- `fillRect(x, y, width, height)` - Fill rectangle
- `strokeRect(x, y, width, height)` - Stroke rectangle
- `clearRect(x, y, width, height)` - Clear rectangle area

#### Text
- `fillText(text, x, y, maxWidth?)` - Fill text
- `strokeText(text, x, y, maxWidth?)` - Stroke text
- `measureText(text)` - Measure text dimensions

#### Transformations
- `save()` - Save current state
- `restore()` - Restore saved state
- `scale(x, y)` - Scale transformation
- `rotate(angle)` - Rotate transformation
- `translate(x, y)` - Translate transformation
- `transform(a, b, c, d, e, f)` - Apply transformation matrix
- `setTransform(a, b, c, d, e, f)` - Set transformation matrix
- `resetTransform()` - Reset to identity matrix

#### Styling
- `setFillStyle(style)` - Set fill color/gradient/pattern
- `setStrokeStyle(style)` - Set stroke color/gradient/pattern
- `setLineWidth(width)` - Set line width
- `setLineCap(cap)` - Set line cap style
- `setLineJoin(join)` - Set line join style
- `setMiterLimit(limit)` - Set miter limit
- `setLineDash(segments)` - Set line dash pattern
- `setLineDashOffset(offset)` - Set line dash offset
- `setFont(font)` - Set text font
- `setTextAlign(align)` - Set text alignment
- `setTextBaseline(baseline)` - Set text baseline
- `setGlobalAlpha(alpha)` - Set global opacity
- `setGlobalCompositeOperation(operation)` - Set blend mode

#### Shadows
- `setShadowBlur(blur)` - Set shadow blur
- `setShadowColor(color)` - Set shadow color
- `setShadowOffsetX(offset)` - Set shadow X offset
- `setShadowOffsetY(offset)` - Set shadow Y offset

#### Scene Rendering
- `render(scene)` - Render scene graph
- `clear()` - Clear entire canvas
- `onResize()` - Update canvas size

## Utility Functions

### drawHexagon

Draw hexagons or hexagon segments:

```typescript
canvas.drawHexagon({
    x: 100,
    y: 100,
    radius: 50,
    angle: 0,           // Optional rotation
    sides: [0, 1, 2],   // Optional: specific sides only
    color: '#ff0000',   // Optional fill color
    strokeColor: '#000', // Optional stroke color
    strokeWidth: 2      // Optional stroke width
})
```

### measureText

Advanced text measurement with styling:

```typescript
const metrics = canvas.measureText({
    text: 'Hello World',
    font: '16px Arial',
    textAlign: 'center',    // Optional
    textBaseline: 'middle'  // Optional
})
```

## Scene Graph

### Scene

Root container for renderable objects:

```typescript
const scene = new Scene()
scene.setBackground('#ffffff')
scene.add(mesh)
scene.remove(mesh)
```

### Object2D

Base class for all renderable objects:

```typescript
object.position.set(x, y)
object.rotation = angle
object.scale.set(sx, sy)
object.visible = true
object.add(child)
object.remove(child)
object.traverse(callback)
```

### Mesh

Combines geometry and material for rendering:

```typescript
const mesh = new Mesh(geometry, material)
mesh.position.set(100, 100)
mesh.render(ctx, pixelRatio)
```

### Group

Container for organizing objects:

```typescript
const group = new Group()
group.add(mesh1)
group.add(mesh2)
group.position.set(50, 50) // Affects all children
```

## Geometry System

### RectGeometry

```typescript
new RectGeometry(width, height, x?, y?)
```

### CircleGeometry

```typescript
new CircleGeometry(radius, x?, y?, startAngle?, endAngle?, counterclockwise?)
```

### EllipseGeometry

```typescript
new EllipseGeometry(radiusX, radiusY, x?, y?, rotation?, startAngle?, endAngle?, counterclockwise?)
```

### PathGeometry

```typescript
const path = new PathGeometry()
path.moveTo(0, 0)
path.lineTo(100, 100)
path.quadraticCurveTo(150, 50, 200, 100)
path.closePath()
```

## Material System

### BasicMaterial

Solid color fill:

```typescript
new BasicMaterial({
    color: '#ff0000',
    opacity: 0.8
})
```

### StrokeMaterial

Outline rendering:

```typescript
new StrokeMaterial({
    color: '#000000',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [5, 5],
    lineDashOffset: 0,
    opacity: 1.0
})
```

### GradientMaterial

Gradient fill:

```typescript
const gradient = ctx.createLinearGradient(0, 0, 100, 100)
gradient.addColorStop(0, '#ff0000')
gradient.addColorStop(1, '#0000ff')

new GradientMaterial({
    gradient,
    opacity: 1.0
})
```

### PatternMaterial

Pattern fill:

```typescript
const pattern = ctx.createPattern(image, 'repeat')

new PatternMaterial({
    pattern,
    opacity: 1.0
})
```

## JSX Support

Declarative scene composition:

```typescript
import { CanvasJSXRenderer } from '@sky-modules/Canvas'

const renderer = new CanvasJSXRenderer({
    container: document.body
})

renderer.render(
    <scene background="#f0f0f0">
        <mesh position={[400, 300]} rotation={Math.PI / 4}>
            <rectGeometry width={100} height={50} />
            <basicMaterial color="#ff0000" />
        </mesh>

        <group position={[200, 200]}>
            <mesh>
                <circleGeometry radius={25} />
                <strokeMaterial color="#0000ff" lineWidth={3} />
            </mesh>
        </group>
    </scene>
)
```

## Pixel Ratio Handling

All coordinate values are automatically scaled by the pixel ratio:

```typescript
const canvas = new Canvas({
    size: () => [400, 300],
    pixelRatio: 2  // 2x scaling for retina displays
})

// Drawing at (100, 100) will actually draw at (200, 200) on the canvas
canvas.fillRect(100, 100, 50, 50)
```

## Performance Tips

1. **Batch operations** - Group multiple drawing calls between save/restore
2. **Reuse objects** - Clone geometries and materials instead of creating new ones
3. **Visibility culling** - Set `visible: false` for off-screen objects
4. **Transform optimization** - Avoid unnecessary transformations
5. **Material caching** - Reuse materials with same properties

## Browser Support

- Modern browsers with HTML5 Canvas support
- ES2015+ environment
- TypeScript 4.0+

## Related

- [Geometry](./Geometry.md) - Shape definitions
- [Material](./Material.md) - Rendering styles
- [Object2D](./Object2D.md) - Transform system