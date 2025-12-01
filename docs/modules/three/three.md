# three

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Three utility module
</div>

<PlaygroundLink id="three" label="Open Three Playground" />


Three.js 3D rendering module with JSX support for declarative scene creation.

## Installation

```bash
npm install @sky-modules/three
```

## Features

- **JSX Syntax** - Declarative Three.js scene creation with React-like JSX
- **ThreeJSXRenderer** - Complete renderer with animation loop and controls
- **Automatic WebGL Setup** - No manual renderer configuration needed
- **Mouse Controls** - Built-in orbit-like camera controls
- **Animation Loop** - Automatic requestAnimationFrame management
- **Update Callbacks** - Per-object update hooks for animations
- **Shadow Support** - Built-in shadow map configuration
- **Responsive** - Automatic window resize handling

## Usage

### Basic Scene

```typescript
import { ThreeJSXRenderer } from '@sky-modules/three/jsx'

const renderer = new ThreeJSXRenderer()

renderer.render(
    <scene background={0x111111}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={0x00ff00} />
        </mesh>
    </scene>
)
```

### Animated Objects

```typescript
renderer.render(
    <scene>
        <mesh
            position={[0, 0, 0]}
            onUpdate={(mesh, time, delta) => {
                // time: elapsed time in seconds
                // delta: time since last frame
                mesh.rotation.x = time
                mesh.rotation.y = time * 0.5
            }}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={0xff0000} />
        </mesh>
    </scene>
)
```

### Custom Camera

```typescript
renderer.render(
    <>
        <camera
            position={[10, 10, 10]}
            fov={60}
            lookAt={[0, 0, 0]}
        />
        <scene>
            {/* scene content */}
        </scene>
    </>
)
```

### Complex Scene

```typescript
renderer.render(
    <scene background={0x222222} fog={{ color: 0x222222, near: 10, far: 50 }}>
        {/* Lighting */}
        <ambientLight color={0x404040} intensity={0.5} />
        <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow={true}
        />
        <pointLight
            position={[-5, 5, -5]}
            color={0xff0000}
            intensity={0.5}
            distance={20}
            decay={2}
        />

        {/* Objects */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <mesh position={[-2, 0, 0]} castShadow={true}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={0x00ff00}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            <mesh position={[2, 0, 0]} castShadow={true}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial
                    color={0x0000ff}
                    transmission={0.9}
                    thickness={1}
                    roughness={0.1}
                />
            </mesh>
        </group>

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={0x808080} />
        </mesh>

        {/* Grid helper */}
        <gridHelper />
    </scene>
)
```

### Lines and Shapes

```typescript
renderer.render(
    <scene>
        {/* Simple line */}
        <line
            points={[
                [0, 0, 0],
                [1, 1, 0],
                [2, 0, 0]
            ]}
            color={0xff0000}
            linewidth={2}
        />

        {/* Closed loop */}
        <lineLoop
            points={[
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]}
            color={0x00ff00}
        />

        {/* Line segments */}
        <lineSegments
            points={[
                [0, 0, 0], [1, 1, 1],
                [2, 0, 0], [3, 1, 1]
            ]}
            color={0x0000ff}
        />
    </scene>
)
```

### Lifecycle Management

```typescript
const renderer = new ThreeJSXRenderer(document.getElementById('container'))

// Render is automatic, but you can control animation loop
renderer.stop()  // Pause rendering
renderer.start() // Resume rendering

// Clean up when done
renderer.dispose() // Stop animation, clear scene, dispose WebGL resources
```

## API

### ThreeJSXRenderer

Main renderer class for JSX-based Three.js scenes.

**Constructor:**
```typescript
new ThreeJSXRenderer(container?: HTMLElement)
```
- `container` - HTML element to mount the canvas (default: document.body)

**Properties:**
- `scene: Three.Scene` - The Three.js scene
- `camera: Three.PerspectiveCamera` - The camera
- `renderer: Three.WebGLRenderer` - The WebGL renderer
- `clock: Three.Clock` - Clock for animation timing

**Methods:**

#### `render(element: JSX.Element | JSX.Element[])`
Renders JSX elements to the Three.js scene.

```typescript
renderer.render(<scene>...</scene>)
```

#### `start()`
Starts the animation loop. Called automatically in constructor.

#### `stop()`
Stops the animation loop to save CPU/GPU resources.

#### `dispose()`
Cleans up all resources (scene, renderer, event listeners).

### JSX Elements

#### `<scene>`
Root scene container.

**Props:**
- `background?: string | number` - Scene background color
- `fog?: { color?: string | number; near?: number; far?: number }` - Scene fog

#### `<camera>`
Camera configuration.

**Props:**
- `position?: [number, number, number]` - Camera position
- `rotation?: [number, number, number]` - Camera rotation
- `fov?: number` - Field of view
- `aspect?: number` - Aspect ratio
- `near?: number` - Near clipping plane
- `far?: number` - Far clipping plane
- `lookAt?: [number, number, number]` - Point to look at

#### `<mesh>`
3D mesh object.

**Props:**
- `position?: [number, number, number]` - Object position
- `rotation?: [number, number, number]` - Object rotation (radians)
- `scale?: [number, number, number]` - Object scale
- `castShadow?: boolean` - Cast shadows
- `receiveShadow?: boolean` - Receive shadows
- `visible?: boolean` - Visibility
- `userData?: any` - Custom data
- `onUpdate?: (mesh: Three.Mesh, time: number, delta: number) => void` - Animation callback

**Children:** Must include one geometry and one material

#### `<group>`
Object grouping.

**Props:**
- `position?: [number, number, number]`
- `rotation?: [number, number, number]`
- `scale?: [number, number, number]`
- `visible?: boolean`

#### Lights

**`<ambientLight>`**
- `color?: string | number` - Light color (default: 0xffffff)
- `intensity?: number` - Light intensity (default: 1)

**`<directionalLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `castShadow?: boolean` - Enable shadow casting

**`<pointLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `distance?: number` - Max light distance (0 = infinite)
- `decay?: number` - Light decay rate (default: 2)

**`<spotLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `target?: [number, number, number]` - Point to illuminate
- `angle?: number` - Light cone angle (default: PI/3)
- `penumbra?: number` - Light edge softness (0-1)
- `decay?: number`
- `distance?: number`

#### Geometries

All geometries use the `args` prop for constructor arguments.

**`<boxGeometry>`**
- `args?: [width?, height?, depth?, widthSegments?, heightSegments?, depthSegments?]`

**`<sphereGeometry>`**
- `args?: [radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?]`

**`<cylinderGeometry>`**
- `args?: [radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<planeGeometry>`**
- `args?: [width?, height?, widthSegments?, heightSegments?]`

**`<coneGeometry>`**
- `args?: [radius?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<torusGeometry>`**
- `args?: [radius?, tube?, radialSegments?, tubularSegments?, arc?]`

#### Materials

**`<meshBasicMaterial>`**
Unlit material.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `side?: Three.Side`

**`<meshStandardMaterial>`**
Physically-based material (PBR).
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `metalness?: number` (0-1)
- `roughness?: number` (0-1)
- `emissive?: string | number`
- `emissiveIntensity?: number`
- `side?: Three.Side`

**`<meshPhongMaterial>`**
Shiny material with specular highlights.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `shininess?: number`
- `specular?: string | number`
- `side?: Three.Side`

**`<meshPhysicalMaterial>`**
Advanced PBR material.
- All `meshStandardMaterial` props, plus:
- `clearcoat?: number` - Clearcoat layer (0-1)
- `clearcoatRoughness?: number`
- `transmission?: number` - Transparency (0-1)
- `thickness?: number` - Refraction thickness
- `ior?: number` - Index of refraction

#### Lines

**`<line>`** - Connected line segments
**`<lineLoop>`** - Closed line loop
**`<lineSegments>`** - Disconnected line segments

**Props:**
- `points?: Array<[number, number, number]>` - Line vertices
- `color?: string | number`
- `linewidth?: number` (note: may not work on all platforms)

#### Helpers

**`<gridHelper>`**
Renders a ground grid (10x10 by default).

## Files

### jsx.tsx

**Purpose:** Main ThreeJSXRenderer implementation
**Key Exports:**
- `ThreeJSXRenderer` - Main renderer class

**Features:**
- JSX element type definitions in global namespace
- Complete scene rendering from JSX
- Animation loop with update callbacks
- Mouse orbit controls (drag to rotate, scroll to zoom)
- Automatic resource cleanup
- Shadow mapping support
- Window resize handling

**Architecture:**
The renderer follows a virtual DOM pattern:
1. JSX elements are transformed to objects with `type`, `props`, `children`
2. `render()` clears previous scene and processes new elements
3. Elements are converted to Three.js objects and added to scene graph
4. Animation loop calls update callbacks and renders each frame
5. `dispose()` cleans up geometries, materials, and renderer

## Related Modules

- [@sky-modules/math](/math) - Vector and matrix math utilities
- [@sky-modules/canvas](/canvas) - 2D canvas rendering
- [@sky-modules/jsx](/jsx) - Universal JSX runtime

## Implementation Notes

### Controls

The built-in mouse controls provide basic orbit camera functionality:
- **Left click + drag** - Rotate camera around origin
- **Mouse wheel** - Zoom in/out (scales camera distance)

The camera always looks at the origin (0, 0, 0) by default.

### Performance

The renderer uses several optimizations:
- **Automatic cleanup** - Geometries and materials are disposed when scene is cleared
- **Update callbacks** - Only objects with `onUpdate` are tracked
- **Single animation loop** - All updates happen in one requestAnimationFrame
- **Shadow map caching** - Shadow maps are configured once at initialization

### Limitations

1. **No texture support yet** - Materials only support colors, not texture maps
2. **Fixed shadow map size** - 2048x2048, not configurable
3. **Simple controls** - No damping, panning, or advanced orbit features
4. **No post-processing** - No bloom, SSAO, or other effects
5. **Static JSX** - No automatic reactivity, must call `render()` again for changes

### Future Enhancements

Possible improvements:
- Texture loading and management
- Custom controls system
- Post-processing effects
- Instanced rendering support
- Reactive JSX with automatic updates
- Loading progress and error handling
- Multiple scene support
- VR/AR support

### Best Practices

```typescript
// Good - reuse renderer
const renderer = new ThreeJSXRenderer()
function updateScene() {
    renderer.render(<scene>...</scene>)
}

// Bad - create new renderer each time
function updateScene() {
    const renderer = new ThreeJSXRenderer() // Memory leak!
    renderer.render(<scene>...</scene>)
}

// Good - use onUpdate for animations
<mesh onUpdate={(mesh, time) => {
    mesh.rotation.y = time
}}>

// Bad - mutate objects outside renderer
const mesh = new Three.Mesh()
setInterval(() => {
    mesh.rotation.y += 0.01 // Won't work with JSX renderer
}, 16)

// Good - dispose when done
useEffect(() => {
    const renderer = new ThreeJSXRenderer()
    return () => renderer.dispose()
}, [])

// Bad - forget to dispose
const renderer = new ThreeJSXRenderer()
// component unmounts - memory leak!
```
