# Canvas Core

Core rendering classes for the Canvas system. Provides the foundational scene graph, rendering engine, and object primitives.

## Overview

Canvas Core implements a scene graph architecture similar to Three.js, but optimized for 2D canvas rendering. It provides:

- **Scene Graph**: Hierarchical organization of drawable objects
- **Transform System**: Position, rotation, scale with world transforms
- **Rendering Engine**: High-performance canvas rendering with pixel ratio support
- **Object Model**: Base classes for all renderable entities

## Core Classes

### Object2D

**File:** `Object2D.ts`

Base class for all objects in the scene graph. Provides transform properties, hierarchy management, and world transform calculation.

**Features:**
- Position, rotation, scale transforms with fluent API
- Parent-child hierarchy with automatic transform propagation
- World transform caching for performance
- Matrix-based transforms (Three.js compatible API)
- Traversal methods for scene graph operations
- Object search by id/name

**Usage:**
```typescript
const obj = new Object2D()
obj
  .setPosition(100, 50)
  .setRotation(Math.PI / 4)
  .setScale(2, 2)
  .setVisible(true)

// Hierarchy
parent.add(child)
parent.remove(child)

// Traversal
obj.traverse(child => console.log(child.name))
obj.traverseVisible(child => { /* only visible */ })

// World transforms
const worldPos = obj.getWorldPosition()
const localPoint = obj.worldToLocal(new Vector2(100, 100))
```

**Properties:**
- `position: Vector2` - Local position
- `rotation: number` - Rotation in radians
- `scale: Vector2` - Local scale
- `visible: boolean` - Visibility flag
- `children: Object2D[]` - Child objects
- `parent: Object2D | null` - Parent object
- `id?: string` - Unique identifier
- `name?: string` - Object name

**Transform Methods:**
- `setPosition(x, y)` - Set position
- `setRotation(angle)` - Set rotation
- `setScale(x, y)` - Set scale
- `translateX(distance)` / `translateY(distance)` - Move along axis
- `rotateZ(angle)` - Rotate around Z axis
- `lookAt(x, y)` - Point towards position

**Hierarchy Methods:**
- `add(object)` - Add child
- `remove(object)` - Remove child
- `traverse(callback)` - Walk all descendants
- `traverseVisible(callback)` - Walk visible descendants only
- `traverseAncestors(callback)` - Walk up parent chain

**World Transform Methods:**
- `getWorldTransform()` - Get cached world transform
- `getWorldPosition()` - Get world position
- `getWorldRotation()` - Get world rotation
- `getWorldScale()` - Get world scale
- `localToWorld(point)` - Transform point from local to world space
- `worldToLocal(point)` - Transform point from world to local space

**Matrix Methods (Three.js compatible):**
- `updateMatrix()` - Update local matrix
- `updateMatrixWorld(force)` - Update world matrix recursively
- `applyMatrix3(matrix)` - Apply matrix transformation

**Search Methods:**
- `getObjectById(id)` - Find object by id
- `getObjectByName(name)` - Find object by name

### Scene

**File:** `Scene.ts`

Root of the scene graph. Extends `Object2D` with background support.

**Features:**
- Scene graph root container
- Background color/gradient/pattern support
- All Object2D hierarchy features

**Usage:**
```typescript
const scene = new Scene()
scene.setBackground('#000000')

// Add objects to scene
scene.add(mesh)
scene.add(group)
```

**Properties:**
- All Object2D properties
- `background?: string | CanvasGradient | CanvasPattern` - Scene background

**Methods:**
- All Object2D methods
- `setBackground(style)` - Set background style
- `clone()` - Deep clone scene

### Mesh

**File:** `Mesh.ts`

Renderable object combining geometry and material. The primary drawable entity.

**Features:**
- Geometry + Material composition
- CSS Box component support (flexbox layouts)
- Overflow scrolling support
- Content dimension tracking
- Custom rendering logic

**Usage:**
```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)

mesh.setPosition(200, 100)
scene.add(mesh)
```

**Properties:**
- All Object2D properties
- `geometry: Geometry` - Shape definition
- `material: Material` - Drawing style
- `isMesh: boolean` - Type identifier (always true)

**Box Component Properties** (set by Box component):
- `_boxStyles?: CSSProperties` - CSS styles for Box rendering
- `_isBox?: boolean` - Box component flag
- `_boxWidth?: number` - Computed box width
- `_boxHeight?: number` - Computed box height
- `_contentHeight?: number` - Total content height (for scrolling)
- `_scrollX: number` - Horizontal scroll offset
- `_scrollY: number` - Vertical scroll offset

**Methods:**
- All Object2D methods
- `render(context, pixelRatio)` - Render to canvas
- `raycast(raycaster, intersects)` - Ray intersection testing
- `clone()` - Clone mesh (shallow copy of geometry/material)

**Rendering:**
The `render` method handles two rendering modes:
1. **Standard Mesh**: Applies material, draws geometry, renders with material
2. **Box Component**: Uses `renderCSSToCanvas` for CSS-like rendering with flexbox

### Group

**File:** `Group.ts`

Container for organizing multiple objects. Useful for grouping related meshes.

**Features:**
- Transform group of objects together
- Organize scene hierarchy
- All Object2D hierarchy features
- Deep cloning support

**Usage:**
```typescript
const group = new Group()
group.add(mesh1)
group.add(mesh2)
group.setPosition(100, 100)

scene.add(group)

// Both meshes move with the group
group.translateX(50)
```

**Properties:**
- All Object2D properties
- `isGroup: boolean` - Type identifier (always true)

**Methods:**
- All Object2D methods
- `clone()` - Deep clone group with all children

### CanvasRenderer

**File:** `CanvasRenderer.ts` (844 lines)

Main rendering engine. Provides fluent API for canvas drawing operations with automatic pixel ratio scaling.

**Features:**
- Canvas initialization and resize handling
- Fluent drawing API (method chaining)
- Automatic devicePixelRatio scaling
- Style management delegation to StyleManager
- Scrollbar rendering delegation to ScrollbarRenderer
- Performance profiling integration
- Scene graph rendering

**Usage:**
```typescript
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'
import Scene from '@sky-modules/canvas/core/Scene'

const canvas = new CanvasRenderer({
  canvas: document.getElementById('canvas'),
  pixelRatio: window.devicePixelRatio
})

const scene = new Scene()
scene.setBackground('#000000')

// Render loop
function animate() {
  canvas.clear()
  canvas.render(scene)
  requestAnimationFrame(animate)
}
animate()
```

**Constructor Parameters:**
```typescript
interface CanvasRendererParameters {
  canvas?: HTMLCanvasElement  // Canvas element (creates new if not provided)
  pixelRatio?: number        // Pixel ratio (defaults to devicePixelRatio)
}
```

**Core Properties:**
- `canvas: HTMLCanvasElement` - DOM canvas element
- `drawContext: CanvasRenderingContext2D` - 2D rendering context
- `pixelRatio: number` - Device pixel ratio

**Rendering Methods:**
- `clear()` - Clear canvas
- `render(scene)` - Render scene graph
- `onResize()` - Handle canvas resize

**Drawing Primitives:**
- `beginPath()` - Start new path
- `closePath()` - Close current path
- `moveTo(x, y)` - Move pen to position
- `lineTo(x, y)` - Draw line to position
- `rect(x, y, w, h)` - Draw rectangle path
- `arc(x, y, r, start, end)` - Draw arc
- `ellipse(x, y, rx, ry, rot, start, end)` - Draw ellipse
- `quadraticCurveTo(cpx, cpy, x, y)` - Quadratic curve
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Bezier curve
- `fill()` - Fill current path
- `stroke()` - Stroke current path
- `clip()` - Clip to current path

**Text Methods:**
- `fillText(text, x, y, maxWidth?)` - Draw filled text
- `strokeText(text, x, y, maxWidth?)` - Draw stroked text
- `measureText(text)` - Measure text dimensions
- `setFont(font)` - Set font style
- `setTextAlign(align)` - Set text alignment
- `setTextBaseline(baseline)` - Set text baseline

**Transform Methods:**
- `save()` - Save canvas state
- `restore()` - Restore canvas state
- `translate(x, y)` - Translate coordinate system
- `rotate(angle)` - Rotate coordinate system
- `scale(x, y)` - Scale coordinate system
- `resetTransform()` - Reset transformation matrix
- `setTransform(a, b, c, d, e, f)` - Set transformation matrix

**Style Methods** (delegated to StyleManager):
- `setFillStyle(style)` - Set fill color/gradient/pattern
- `setStrokeStyle(style)` - Set stroke color/gradient/pattern
- `setLineWidth(width)` - Set line width (auto-scaled by pixelRatio)
- `setLineCap(cap)` - Set line cap style
- `setLineJoin(join)` - Set line join style
- `setMiterLimit(limit)` - Set miter limit
- `setLineDash(segments)` - Set dash pattern (auto-scaled by pixelRatio)
- `setLineDashOffset(offset)` - Set dash offset (auto-scaled by pixelRatio)
- `setGlobalAlpha(alpha)` - Set global opacity
- `setGlobalCompositeOperation(op)` - Set composite operation
- `setShadowBlur(blur)` - Set shadow blur (auto-scaled by pixelRatio)
- `setShadowColor(color)` - Set shadow color
- `setShadowOffsetX(offset)` - Set shadow X offset (auto-scaled by pixelRatio)
- `setShadowOffsetY(offset)` - Set shadow Y offset (auto-scaled by pixelRatio)

**Gradient/Pattern Methods:**
- `createLinearGradient(x0, y0, x1, y1)` - Create linear gradient
- `createRadialGradient(x0, y0, r0, x1, y1, r1)` - Create radial gradient
- `createConicGradient(angle, x, y)` - Create conic gradient
- `createPattern(image, repetition)` - Create pattern

**Image Methods:**
- `drawImage(image, ...args)` - Draw image to canvas

**Pixel Manipulation:**
- `getImageData(x, y, w, h)` - Get pixel data
- `putImageData(imageData, x, y)` - Put pixel data
- `createImageData(w, h)` - Create new pixel data

## Specialized Modules

### StyleManager

**File:** `styles/StyleManager.ts`

Centralized canvas context style management with automatic pixel ratio scaling.

**Features:**
- Fluent API for style operations
- Automatic pixel ratio scaling for dimensions
- Reduces redundant style state changes
- Method chaining support

**Usage:**
```typescript
import { StyleManager } from '@sky-modules/canvas/core/styles/StyleManager'

const styleManager = new StyleManager(context, pixelRatio)

styleManager
  .setFillStyle('#ff0000')
  .setLineWidth(2)
  .setGlobalAlpha(0.8)
  .withShadow(5, 'rgba(0,0,0,0.3)')
```

See [styles/README.md](./styles/README.md) for full documentation.

### ScrollbarRenderer

**File:** `renderers/ScrollbarRenderer.ts`

Renders scrollbars for overflow containers.

**Features:**
- Pill-shaped scrollbar design
- Configurable appearance
- Automatic thumb sizing
- Pixel-perfect rendering

**Usage:**
```typescript
import { ScrollbarRenderer } from '@sky-modules/canvas/core/renderers/ScrollbarRenderer'

const scrollbarRenderer = new ScrollbarRenderer(context)

scrollbarRenderer.render({
  object: mesh,
  x: meshX,
  y: meshY,
  pixelRatio: window.devicePixelRatio
})
```

See [renderers/README.md](./renderers/README.md) for full documentation.

## Architecture Principles

### Scene Graph

Canvas Core uses a hierarchical scene graph similar to Three.js:

```
Scene (root)
├── Mesh (geometry + material)
├── Group
│   ├── Mesh
│   └── Mesh
└── Mesh
```

**Benefits:**
- Intuitive object organization
- Automatic transform propagation
- Easy object management
- Efficient traversal

### Transform System

Transforms are hierarchical and cached for performance:

1. **Local Transform**: Object's position/rotation/scale
2. **World Transform**: Accumulated transform from root to object
3. **Caching**: World transforms cached and invalidated on change
4. **Matrix Support**: Three.js compatible matrix operations

### Composition over Inheritance

Objects are composed from:
- **Geometry**: What to draw (shape)
- **Material**: How to draw (style)
- **Transform**: Where to draw (position/rotation/scale)

This allows flexible combinations without deep inheritance hierarchies.

### Pixel Ratio Scaling

All dimension-related operations automatically scale by `devicePixelRatio` for crisp rendering on high-DPI displays:

```typescript
// User code (logical pixels)
renderer.setLineWidth(2)
renderer.rect(10, 10, 100, 50)

// Internal (physical pixels)
context.lineWidth = 2 * pixelRatio
context.rect(10 * pixelRatio, 10 * pixelRatio, 100 * pixelRatio, 50 * pixelRatio)
```

## Performance Optimizations

### World Transform Caching

Object2D caches world transforms to avoid recomputation:

```typescript
// First call - computes and caches
const transform1 = obj.getWorldTransform()

// Second call - returns cached (if not invalidated)
const transform2 = obj.getWorldTransform()
```

Cache is invalidated when:
- Object's local transform changes
- Parent's world transform changes

### Object Reuse

Canvas JSX system reuses Mesh/Group instances across renders to minimize allocations (see `ObjectManager.ts`).

### Render Culling

Invisible objects are skipped during rendering:

```typescript
obj.setVisible(false)
// obj and all descendants won't be rendered
```

Use `traverseVisible()` for visible-only traversal.

## Integration Points

### Canvas JSX

Canvas Core is the foundation for Canvas JSX:

```tsx
<Scene background="#000">
  <Mesh position={[100, 100]}>
    <RectGeometry width={50} height={50} />
    <BasicMaterial color="#ff0000" />
  </Mesh>
</Scene>
```

Compiles to:
```typescript
const scene = new Scene().setBackground('#000')
const mesh = new Mesh(
  new RectGeometry({ width: 50, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
mesh.setPosition(100, 100)
scene.add(mesh)
```

### Geometries & Materials

Canvas Core provides the base for geometry and material systems:

- **Geometries**: Define shapes (see [../geometries/](../geometries/))
- **Materials**: Define drawing styles (see [../materials/](../materials/))

### CSS Rendering

Mesh supports CSS-like rendering for Box components:

```typescript
mesh._isBox = true
mesh._boxStyles = {
  width: '200px',
  height: '100px',
  background: 'linear-gradient(to right, red, blue)',
  border: '2px solid white',
  borderRadius: '8px'
}
```

## Extension Points

### Custom Object Types

Extend Object2D for custom object types:

```typescript
class Sprite extends Object2D {
  texture: Texture

  constructor(texture: Texture) {
    super()
    this.texture = texture
  }

  render(context: CanvasRenderingContext2D) {
    // Custom rendering
  }
}
```

### Custom Rendering

Override `render` method in Mesh for custom rendering:

```typescript
class CustomMesh extends Mesh {
  render(ctx: CanvasRenderingContext2D, pixelRatio: number) {
    // Custom rendering logic
    super.render(ctx, pixelRatio)
  }
}
```

## Type Guards

Use type properties to identify object types:

```typescript
if (obj.isMesh) {
  // obj is Mesh
}

if (obj.isGroup) {
  // obj is Group
}
```

## Related Documentation

- [Canvas JSX README](../jsx/README.md) - Canvas JSX system
- [Canvas JSX Utils README](../jsx/utils/README.md) - JSX utility modules
- [Renderers README](./renderers/README.md) - Specialized renderers
- [Styles README](./styles/README.md) - Style management
- [Geometries](../geometries/) - Geometry classes
- [Materials](../materials/) - Material classes

## Examples

### Basic Scene Setup

```typescript
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'
import Scene from '@sky-modules/canvas/core/Scene'
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const canvas = new CanvasRenderer({
  canvas: document.getElementById('canvas')
})

const scene = new Scene()
scene.setBackground('#1a1a1a')

const rect = new Mesh(
  new RectGeometry({ width: 100, height: 100 }),
  new BasicMaterial({ color: '#ff0000' })
)
rect.setPosition(200, 150)

scene.add(rect)

function animate() {
  canvas.clear()
  rect.rotateZ(0.01)
  canvas.render(scene)
  requestAnimationFrame(animate)
}
animate()
```

### Hierarchical Transforms

```typescript
const parent = new Group()
parent.setPosition(400, 300)

const child1 = new Mesh(geometry1, material1)
child1.setPosition(50, 0) // 50 pixels right of parent

const child2 = new Mesh(geometry2, material2)
child2.setPosition(-50, 0) // 50 pixels left of parent

parent.add(child1)
parent.add(child2)
scene.add(parent)

// Rotating parent rotates both children around parent's position
parent.rotateZ(0.01)
```

### World Transform Queries

```typescript
const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)

const group = new Group()
group.setPosition(50, 50)
group.setRotation(Math.PI / 4)
group.add(mesh)

// Local position: (100, 100)
console.log(mesh.position)

// World position: (50, 50) + rotated (100, 100)
console.log(mesh.getWorldPosition())

// Convert world point to local coordinates
const localPoint = mesh.worldToLocal(new Vector2(200, 200))
```

### Scene Traversal

```typescript
// Find all meshes in scene
const meshes = []
scene.traverse(obj => {
  if (obj.isMesh) {
    meshes.push(obj)
  }
})

// Find object by name
const player = scene.getObjectByName('player')

// Update all visible objects
scene.traverseVisible(obj => {
  if (obj.isMesh) {
    obj.rotateZ(0.01)
  }
})
```
