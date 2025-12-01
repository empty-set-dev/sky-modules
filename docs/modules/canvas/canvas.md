# @sky-modules/canvas

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Canvas utility module
</div>

A 2D rendering system for drawing shapes, text, and complex graphics with HTML5 Canvas API.

## Installation

```bash
npm install @sky-modules/canvas
```

## Features

- **High-level drawing API** - Simplified methods for common drawing operations
- **Pixel ratio support** - Automatic scaling for high-DPI displays
- **Scene graph rendering** - Hierarchical object management
- **Material system** - Different rendering styles (fill, stroke, gradient, pattern)
- **Geometry system** - Reusable shape definitions
- **JSX support** - Declarative scene composition with React-like syntax
- **Transform system** - Position, rotation, scale with world coordinates

## Quick Start

```typescript
import Canvas, { Scene, Mesh, RectGeometry, BasicMaterial } from '@sky-modules/canvas'

// Create canvas
const canvas = new Canvas({
    size: () => [800, 600],
    pixelRatio: window.devicePixelRatio
})

// Create scene
const scene = new Scene()
scene.setBackground('#f0f0f0')

// Create a rectangle
const geometry = new RectGeometry(100, 50)
const material = new BasicMaterial({ color: '#ff0000' })
const mesh = new Mesh(geometry, material)

mesh.position.set(400, 300)
scene.add(mesh)

// Render
canvas.render(scene)
```

## JSX Support

Use declarative JSX syntax for scene composition:

```tsx
import { Canvas, Scene, Rect, Circle } from '@sky-modules/canvas/jsx'

<Canvas size={[800, 600]} pixelRatio={2}>
    <Scene background="#ffffff">
        <Rect
            width={100}
            height={50}
            x={400}
            y={300}
            fill="#ff0000"
        />
        <Circle
            radius={25}
            x={200}
            y={200}
            fill="#00ff00"
        />
    </Scene>
</Canvas>
```

## Core Components

### Canvas
Main rendering context with automatic pixel ratio handling.

### Scene
Container for renderable objects with background and transform support.

### Mesh
Combines geometry and material for rendering.

### Geometries
- **RectGeometry** - Rectangles and squares
- **CircleGeometry** - Circles and arcs
- **PathGeometry** - Custom paths
- **TextGeometry** - Rendered text

### Materials
- **BasicMaterial** - Solid colors
- **GradientMaterial** - Linear and radial gradients
- **PatternMaterial** - Image patterns
- **StrokeMaterial** - Strokes with various styles

## Use Cases

Perfect for:

- 📊 **Data visualization** - Charts, graphs, and diagrams
- 🎮 **2D games** - Sprites, animations, and particle systems
- 🎨 **Drawing applications** - Interactive canvases and editors
- 📐 **Geometric visualizations** - Shapes, patterns, and fractals

## Module Structure

### Core Rendering
- **[core/](./core/)** - Scene graph, rendering engine, and object primitives
  - `CanvasRenderer.ts` - Main rendering engine with fluent API
  - `Scene.ts` - Root scene graph container
  - `Mesh.ts` - Renderable object (geometry + material)
  - `Group.ts` - Container for organizing objects
  - `Object2D.ts` - Base class with transforms and hierarchy
  - `Raycaster.ts` - Mouse picking and hit testing
  - `UniversalCanvasAppLauncher.tsx` - Cross-platform app launcher
  - **[renderers/](./core/renderers/)** - Specialized renderers
    - `ScrollbarRenderer.ts` - Scrollbar rendering for overflow containers
    - `ScrollbarConfig.ts` - Scrollbar configuration
  - **[styles/](./core/styles/)** - Style management
    - `StyleManager.ts` - Canvas context style management with pixel ratio scaling
  - **[utils/](./core/utils/)** - Utilities
    - `PerformanceProfiler.ts` - Performance monitoring and profiling

### Shapes & Drawing Styles
- **[geometries/](./geometries/)** - Shape definitions (what to draw)
  - `Geometry.ts` - Abstract base class
  - `RectGeometry.ts` - Rectangles and squares
  - `CircleGeometry.ts` - Circles and arcs
  - `EllipseGeometry.ts` - Elliptical shapes
  - `PathGeometry.ts` - Custom paths with fluent API
  - `PolylineGeometry.ts` - Multi-point lines and polygons
  - `SplineGeometry.ts` - Smooth curves (Catmull-Rom splines)
  - `TextGeometry.ts` - Text rendering

- **[materials/](./materials/)** - Drawing styles (how to draw)
  - `Material.ts` - Abstract base class with common properties
  - `BasicMaterial.ts` - Solid color fills
  - `StrokeMaterial.ts` - Outlines and strokes
  - `GradientMaterial.ts` - Linear/radial/conic gradients
  - `StrokeGradientMaterial.ts` - Gradient strokes
  - `FillStrokeMaterial.ts` - Combined fill and stroke
  - `PatternMaterial.ts` - Repeating pattern fills

### JSX System
- **[jsx/](./jsx/)** - Declarative JSX rendering
  - `jsx.tsx` - Main JSX implementation (primitives and components)
  - **[box/](./jsx/box/)** - CSS-like Box component
    - `Box.implementation.tsx` - Flexbox container with CSS support
    - `styles-parser.ts` - CSS property parsing
    - `twrn.ts` - Tailwind-to-React-Native style conversion
    - `tokens.ts` - Design system tokens
  - **[utils/](./jsx/utils/)** - JSX utilities
    - `AnimationLoop.ts` - Render loop management
    - `ObjectManager.ts` - Object lifecycle and caching
    - `GeometryMaterialManager.ts` - Geometry/Material factory
    - `ScrollManager.ts` - Scroll interaction handling
    - `JSXPerformanceProfiler.ts` - JSX performance monitoring

### CSS Rendering
- **[rendering/](./rendering/)** - CSS-to-Canvas conversion
  - `renderCSSToCanvas.ts` - Main CSS renderer
  - `wrapText.ts` - Text wrapping utilities
  - **[utils/](./rendering/utils/)** - Rendering utilities
    - `parsing.ts` - CSS value parsing
    - `drawing.ts` - Drawing helpers
    - `text.ts` - Text rendering utilities
    - `layout.ts` - Flexbox layout engine

### Mitosis Component
- **[Canvas/](./Canvas/)** - Cross-framework Canvas component
  - `Canvas.lite.tsx` - Mitosis Canvas component

## Documentation

For complete API reference and examples, visit:
- [Full Documentation](https://empty-set-dev.github.io/sky-modules/modules/canvas)
- [Core README](./core/README.md) - Core rendering classes
- [Geometries README](./geometries/README.md) - Shape definitions
- [Materials README](./materials/README.md) - Drawing styles
- [JSX README](./jsx/README.md) - JSX system specification
- [Renderers README](./core/renderers/README.md) - Specialized renderers
- [Styles README](./core/styles/README.md) - Style management

## License

ISC License - see the [LICENSE](../LICENSE) file for details.
