# Canvas JSX Utils

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  utils utility module
</div>

Utility modules for Canvas JSX system. These modules were extracted from the main `jsx.tsx` file to improve maintainability and separation of concerns.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { utils } from '@sky-modules/core'
```

## Modules

### AnimationLoop

**File:** `AnimationLoop.ts`

Animation loop manager for Canvas JSX. Handles the requestAnimationFrame loop, time tracking, and per-object update callbacks.

**Features:**
- Automatic frame timing (time and delta calculation)
- Per-object update callbacks with reactive batching using SolidJS
- Custom frame callbacks for global updates
- Start/stop control for the animation loop

**Usage:**
```typescript
const loop = new AnimationLoop(canvas, scene, () => objects)

// Add object update callback
loop.addUpdateCallback('cube', (obj, time, delta) => {
  obj.rotation += delta
})

// Start animation
loop.start()

// Stop when done
loop.stop()
```

### ObjectManager

**File:** `ObjectManager.ts`

Object lifecycle manager for Canvas JSX components. Manages object caching, render order, and automatic cleanup.

**Features:**
- Object caching for reuse across renders (performance optimization)
- Render order tracking for proper z-index
- Automatic cleanup of unused objects
- Scene hierarchy management

**Usage:**
```typescript
const manager = new ObjectManager(scene)

// Mark object as used in this render
manager.markKeyUsed('box-1', 0)

// Get cached object or create new
let obj = manager.getCached('box-1')
if (!obj) {
  obj = new Mesh()
  manager.cache('box-1', obj)
}

// Cleanup unused objects after render
manager.cleanupUnusedObjects(updateCallbacks)
```

### GeometryMaterialManager

**File:** `GeometryMaterialManager.ts`

Factory for creating and updating geometries and materials from JSX elements.

**Features:**
- Factory pattern for creating geometries and materials
- Support for all canvas geometry types (Rect, Circle, Text, etc.)
- Support for all material types (Basic, Gradient, Pattern, etc.)
- Reactive property updates for existing instances
- Function component resolution

**Usage:**
```typescript
const manager = new GeometryMaterialManager()

// Create geometry from JSX element
const geometry = manager.createGeometryOrMaterial({
  type: 'RectGeometry',
  props: { width: 100, height: 50 }
})

// Update geometry properties reactively
manager.updateGeometryOrMaterial(element, mesh)
```

**Supported Geometries:**
- RectGeometry
- CircleGeometry
- EllipseGeometry
- PathGeometry
- PolylineGeometry
- SplineGeometry
- TextGeometry

**Supported Materials:**
- BasicMaterial
- StrokeMaterial
- GradientMaterial
- StrokeGradientMaterial
- PatternMaterial

### ScrollManager

**File:** `ScrollManager.ts`

Handles mouse wheel scrolling and scrollbar dragging for overflow containers in Canvas JSX.

**Features:**
- Mouse wheel scrolling for `overflow:auto`/`scroll` containers
- Scrollbar drag-to-scroll interaction
- Automatic scrollbar bounds calculation
- Nested scrollable container support
- Event listener cleanup

**Usage:**
```typescript
const scrollManager = new ScrollManager(canvas.domElement, scene)

// Scrolling is handled automatically via event listeners

// Get scrollbar bounds for rendering
const bounds = scrollManager.getScrollbarThumbBounds(box)
if (bounds) {
  // Render scrollbar at bounds.x, bounds.y
}

// Cleanup when done
scrollManager.dispose()
```

### JSXPerformanceProfiler

**File:** `JSXPerformanceProfiler.ts`

Performance profiling utility for Canvas JSX rendering.

**Features:**
- Render timing tracking
- Performance metrics collection
- Bottleneck identification

**Usage:**
```typescript
const profiler = new JSXPerformanceProfiler()

profiler.startFrame()
// ... rendering code ...
profiler.endFrame()

const metrics = profiler.getMetrics()
```

## Architecture

These utilities follow the Single Responsibility Principle, each handling one specific aspect of the Canvas JSX system:

1. **AnimationLoop** - Frame loop and timing
2. **ObjectManager** - Object lifecycle and caching
3. **GeometryMaterialManager** - Factory for creating/updating geometries and materials
4. **ScrollManager** - User interaction for scrolling
5. **JSXPerformanceProfiler** - Performance monitoring

All utilities are designed to work together within the Canvas JSX system while remaining decoupled and testable.

## Related Files

- `../jsx.tsx` - Main Canvas JSX implementation that uses these utilities
- `../box/Box.implementation.tsx` - Box component using these utilities
- `../../core/` - Core canvas rendering classes
