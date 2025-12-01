# @sky-modules/canvas

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

## Documentation

For complete API reference and examples, visit the [full documentation](https://empty-set-dev.github.io/sky-modules/modules/canvas).

## License

ISC License - see the [LICENSE](../LICENSE) file for details.
