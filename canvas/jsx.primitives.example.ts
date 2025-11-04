import { CanvasJSXRenderer } from './jsx'

// Example: Rendering primitive types in JSX
const canvas = document.createElement('canvas')
const renderer = new CanvasJSXRenderer({ canvas })

// Example 1: Render a string
renderer.render(
    <Scene>
        <Mesh position={[50, 50]}>
            <TextGeometry text="Hello World!" fontSize={24} fontFamily="Arial" />
            <BasicMaterial color="#000000" />
        </Mesh>
    </Scene>
)

// Example 2: Render primitives directly in JSX
renderer.render(
    <Scene>
        <Mesh position={[50, 50]}>{'Direct string in JSX'}</Mesh>
        <Mesh position={[50, 100]}>{42}</Mesh>
        <Mesh position={[50, 150]}>{true}</Mesh>
        <Mesh position={[50, 200]}>{false}</Mesh>
    </Scene>
)

// Example 3: Mixed content
renderer.render(
    <Scene>
        <Mesh position={[50, 50]}>
            <RectGeometry width={200} height={50} />
            <BasicMaterial color="#4A90E2" />
        </Mesh>
        <Mesh position={[60, 65]}>{'Score: '}</Mesh>
        <Mesh position={[120, 65]}>{9000}</Mesh>
    </Scene>
)

// Example 4: Dynamic content with signals (if using Solid.js)
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)

renderer.render(() => (
    <Scene>
        <Mesh position={[50, 50]}>
            <TextGeometry text={`Count: ${count()}`} fontSize={32} />
            <BasicMaterial color="#E74C3C" />
        </Mesh>
    </Scene>
))

// Update count
setInterval(() => setCount(c => c + 1), 1000)
