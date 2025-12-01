# Canvas JSX System Specification

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  jsx utility module
</div>

<PlaygroundLink id="canvas" label="Open Canvas Playground" />



## Installation

```bash
npm install @sky-modules/core
```

## Overview

Canvas JSX is a declarative rendering system that brings JSX syntax to HTML5 Canvas. It combines the power of SolidJS reactivity with canvas rendering for high-performance 2D graphics.

**Version:** 1.0
**Last Updated:** 2025-11-29

## Architecture

### Core Components

```
canvas/
├── core/                       # Core rendering classes
│   ├── CanvasRenderer.ts      # Main renderer (844 lines)
│   ├── Scene.ts               # Scene graph root
│   ├── Mesh.ts                # Renderable object
│   ├── Group.ts               # Object container
│   ├── renderers/             # Specialized renderers
│   │   ├── ScrollbarRenderer.ts
│   │   └── ScrollbarConfig.ts
│   └── styles/                # Style management
│       └── StyleManager.ts
├── jsx/                        # JSX system
│   ├── jsx.tsx                # Main JSX implementation (962 lines)
│   ├── box/                   # Box component (CSS-like containers)
│   └── utils/                 # JSX utilities
│       ├── AnimationLoop.ts
│       ├── ObjectManager.ts
│       ├── GeometryMaterialManager.ts
│       ├── ScrollManager.ts
│       └── JSXPerformanceProfiler.ts
├── geometries/                 # Shape definitions
│   ├── RectGeometry.ts
│   ├── CircleGeometry.ts
│   ├── TextGeometry.ts
│   └── ...
├── materials/                  # Drawing styles
│   ├── BasicMaterial.ts
│   ├── GradientMaterial.ts
│   ├── PatternMaterial.ts
│   └── ...
└── rendering/                  # CSS rendering
    └── renderCSSToCanvas.ts
```

## Design Principles

### 1. Declarative API

Canvas JSX uses JSX syntax for declarative canvas rendering:

```tsx
<Canvas size={() => [800, 600]}>
  <Scene background="#000">
    <Mesh position={[100, 100]}>
      <RectGeometry width={50} height={50} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  </Scene>
</Canvas>
```

### 2. Reactive System

Powered by SolidJS for fine-grained reactivity:

```tsx
const [x, setX] = createSignal(0)

<Mesh position={[x(), 100]} />
// Automatically re-renders when x() changes
```

### 3. Component Composition

Support for reusable components:

```tsx
function Button(props) {
  return (
    <Box styles={{ padding: '10px', background: '#333' }}>
      <Text text={props.label} color="#fff" />
    </Box>
  )
}
```

### 4. Performance Optimization

- **Object Caching**: Reuses objects across renders
- **Batched Updates**: Groups signal updates
- **Render Order**: Optimizes draw calls
- **Cleanup**: Automatic disposal of unused objects

## Core Classes

### CanvasRenderer

Main canvas rendering class with fluent API.

**Responsibilities:**
- Canvas initialization and resize handling
- Drawing operations (shapes, paths, text)
- Style management delegation
- Scrollbar rendering delegation
- Performance profiling

**Key Methods:**
```typescript
class CanvasRenderer {
  constructor(params: CanvasRendererParameters)
  render(scene: Scene): void
  clear(): this
  beginPath(): this
  rect(x, y, width, height): this
  fill(): this
  stroke(): this
  // ... 50+ drawing methods
}
```

### Scene

Root of the scene graph, contains all renderable objects.

```typescript
class Scene extends Object3D {
  background?: string | CanvasGradient | CanvasPattern
  children: Array<Mesh | Group>
  add(child: Mesh | Group): void
  remove(child: Mesh | Group): void
}
```

### Mesh

Renderable object combining geometry and material.

```typescript
class Mesh extends Object3D {
  geometry: Geometry
  material: Material
  position: Vector2
  rotation: number
  scale: Vector2
  visible: boolean
}
```

### Group

Container for organizing multiple objects.

```typescript
class Group extends Object3D {
  children: Array<Mesh | Group>
  add(child: Mesh | Group): void
  remove(child: Mesh | Group): void
}
```

## JSX System

### Component Model

Canvas JSX supports three types of components:

#### 1. Primitive Components
Built-in JSX elements:
- `<Canvas>` - Root canvas element
- `<Scene>` - Scene graph root
- `<Mesh>` - Renderable object
- `<Group>` - Object container
- `<Box>` - CSS-like container

#### 2. Geometry Components
Shape definitions:
- `<RectGeometry>`
- `<CircleGeometry>`
- `<TextGeometry>`
- `<PathGeometry>`
- `<PolylineGeometry>`
- `<SplineGeometry>`

#### 3. Material Components
Drawing styles:
- `<BasicMaterial>`
- `<StrokeMaterial>`
- `<GradientMaterial>`
- `<StrokeGradientMaterial>`
- `<PatternMaterial>`

### Lifecycle

```
1. JSX Parse → createElement() calls
2. Component Instantiation → createMesh()
3. Object Caching → ObjectManager.cache()
4. Render Order → ObjectManager.sortSceneChildren()
5. Frame Render → AnimationLoop.animate()
6. Update Callbacks → Execute per-object updates
7. Cleanup → ObjectManager.cleanupUnusedObjects()
```

### Animation System

**AnimationLoop** manages the render loop:

```typescript
const loop = new AnimationLoop(canvas, scene, () => objects)

// Per-object updates
loop.addUpdateCallback('cube', (obj, time, delta) => {
  obj.rotation += delta
})

loop.start()
```

**Features:**
- Automatic time/delta calculation
- Batched reactive updates
- Per-object callbacks
- Custom frame callbacks

### Object Management

**ObjectManager** handles object lifecycle:

```typescript
const manager = new ObjectManager(scene)

// Mark as used
manager.markKeyUsed('box-1', 0)

// Cache for reuse
manager.cache('box-1', mesh)

// Cleanup unused
manager.cleanupUnusedObjects(callbacks)
```

**Benefits:**
- Reduces object allocation
- Prevents memory leaks
- Maintains render order
- Improves performance

### Geometry/Material Factory

**GeometryMaterialManager** creates instances from JSX:

```typescript
const manager = new GeometryMaterialManager()

// Create from JSX element
const geometry = manager.createGeometryOrMaterial({
  type: 'RectGeometry',
  props: { width: 100, height: 50 }
})

// Update existing instance
manager.updateGeometryOrMaterial(element, mesh)
```

### Scroll System

**ScrollManager** handles user interaction:

```typescript
const scrollManager = new ScrollManager(canvas.domElement, scene)

// Automatic wheel scrolling
// Automatic scrollbar dragging

// Get bounds for rendering
const bounds = scrollManager.getScrollbarThumbBounds(box)

// Cleanup
scrollManager.dispose()
```

**ScrollbarRenderer** renders scrollbars:

```typescript
const renderer = new ScrollbarRenderer(context, {
  width: 12,
  margin: 2,
  trackColor: 'rgba(0, 0, 0, 0.1)',
  thumbColor: 'rgba(0, 0, 0, 0.3)'
})

renderer.render({ object: mesh, x, y, pixelRatio })
```

## Box Component

Special component providing CSS-like layout in canvas.

### Features

- Flexbox layout (via Yoga)
- CSS property support
- Overflow scrolling
- Border rendering
- Background styles
- Panda CSS integration

### Usage

```tsx
<Box
  styles={{
    width: '200px',
    height: '300px',
    padding: '10px',
    background: 'linear-gradient(to bottom, #f00, #00f)',
    border: '2px solid #fff',
    borderRadius: '8px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }}
>
  {/* Children with automatic layout */}
</Box>
```

### Layout Engine

Uses **Yoga** for flexbox calculations:
1. Parse CSS properties
2. Build Yoga node tree
3. Calculate layout
4. Position children
5. Render to canvas

### Scroll Implementation

**Overflow Handling:**
- `overflow: 'auto'` - Scrollbar when needed
- `overflow: 'scroll'` - Always show scrollbar
- `overflow: 'hidden'` - Clip content

**Scrollbar:**
- Pill-shaped design
- Configurable colors
- Mouse wheel support
- Drag-to-scroll
- Pixel-perfect rendering

## Styling System

### StyleManager

Fluent API for canvas styles with automatic pixel ratio scaling:

```typescript
styleManager
  .setFillStyle('#ff0000')
  .setLineWidth(2)
  .withShadow(5, 'rgba(0,0,0,0.3)')
  .setGlobalAlpha(0.8)
```

**Auto-scaling:**
All dimensions scale by `devicePixelRatio`:
```typescript
setLineWidth(2)  // → context.lineWidth = 2 * pixelRatio
```

### CSS-to-Canvas

**renderCSSToCanvas** converts CSS to canvas calls:

```typescript
renderCSSToCanvas(context, {
  background: 'linear-gradient(to right, red, blue)',
  border: '2px solid #fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
})
```

Supports:
- Linear/radial gradients
- Borders with radius
- Box shadows
- Background colors
- Pattern fills

## Performance

### Optimization Strategies

1. **Object Pooling**
   - Reuse Mesh/Group instances
   - Prevent garbage collection

2. **Batched Updates**
   - Use SolidJS batch()
   - Group signal updates

3. **Render Order**
   - Sort by z-index once
   - Avoid re-sorting

4. **Dirty Tracking**
   - Only update changed objects
   - Skip unchanged renders

5. **Canvas Optimization**
   - Minimize state changes
   - Batch drawing operations
   - Use path caching

### Profiling

**JSXPerformanceProfiler** tracks metrics:

```typescript
const profiler = new JSXPerformanceProfiler()

profiler.startFrame()
// ... rendering ...
profiler.endFrame()

const metrics = profiler.getMetrics()
console.log(metrics.averageFPS)
```

## Integration Points

### SolidJS

Canvas JSX is built on SolidJS primitives:
- `createSignal` - Reactive state
- `createEffect` - Side effects
- `batch` - Batched updates
- `untrack` - Escape reactivity

### Yoga Layout

Flexbox layout via Yoga:
- Node creation
- Style application
- Layout calculation
- Position extraction

### Panda CSS

Design system integration:
- Style recipes
- CSS variables
- Token system
- Theme support

## Extension Points

### Custom Geometries

```typescript
class CustomGeometry extends Geometry {
  render(context: CanvasRenderingContext2D): void {
    // Custom drawing logic
  }
}
```

### Custom Materials

```typescript
class CustomMaterial extends Material {
  apply(context: CanvasRenderingContext2D): void {
    // Custom style application
  }
}
```

### Custom Components

```typescript
function CustomComponent(props) {
  return (
    <Mesh>
      <CustomGeometry {...props} />
      <CustomMaterial color={props.color} />
    </Mesh>
  )
}
```

## Testing Strategy

### Unit Tests
- Individual class methods
- Utility functions
- Geometry calculations

### Integration Tests
- Component rendering
- Layout engine
- Scroll behavior
- Event handling

### Visual Tests
- Screenshot comparison
- Canvas output validation
- Cross-browser testing

## Future Enhancements

### Planned Features
- WebGL backend for 3D
- GPU-accelerated filters
- Advanced text layout
- Animation timeline
- Gesture recognition
- Touch support

### Performance Goals
- 60 FPS for 1000+ objects
- < 16ms frame time
- < 100MB memory usage
- Lazy loading support

## Related Documentation

- [Canvas JSX Utils README](./utils/README.md)
- [Canvas Core Renderers README](../core/renderers/README.md)
- [Canvas Core Styles README](../core/styles/README.md)
- [Mitosis Framework Generators](../../cli/mitosis/framework-generators/README.md)

## Glossary

- **Canvas**: HTML5 2D drawing surface
- **Scene Graph**: Tree structure of renderable objects
- **Mesh**: Combination of geometry and material
- **Geometry**: Shape definition (what to draw)
- **Material**: Style definition (how to draw)
- **SolidJS**: Reactive JavaScript library
- **Yoga**: Flexbox layout engine
- **Panda CSS**: Design system framework
