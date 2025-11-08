/**
 * Example demonstrating Box component with CSS styles, twrn, and style props
 */

import { CanvasJSXRenderer, Box } from '../jsx/jsx'

// Create a container element
const container = document.createElement('div')
container.style.width = '800px'
container.style.height = '600px'
document.body.appendChild(container)

// Initialize the renderer
const renderer = new CanvasJSXRenderer({ container })

// Example 1: Box with direct CSS props
const example1 = (
    <Box
        width={200}
        height={100}
        backgroundColor="#ff0000"
        borderRadius={10}
        position={[50, 50]}
    />
)

// Example 2: Box with Tailwind classes (twrn)
const example2 = (
    <Box
        className="w-100 h-100 bg-blue rounded-lg p-4"
        position={[280, 50]}
    />
)

// Example 3: Box with style prop
const example3 = (
    <Box
        style={{
            width: '150px',
            height: '150px',
            backgroundColor: '#00ff00',
            borderRadius: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
        position={[50, 180]}
    />
)

// Example 4: Box with flexbox layout
const example4 = (
    <Box
        width={400}
        height={150}
        backgroundColor="#f0f0f0"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        gap={10}
        padding={20}
        position={[50, 360]}
    >
        <Box width={80} height={80} backgroundColor="#ff0000" borderRadius={8} />
        <Box width={80} height={80} backgroundColor="#00ff00" borderRadius={8} />
        <Box width={80} height={80} backgroundColor="#0000ff" borderRadius={8} />
    </Box>
)

// Example 5: Box with combined props (priority test)
const example5 = (
    <Box
        className="bg-blue p-4"
        style={{ backgroundColor: '#00ff00' }}
        backgroundColor="#ff0000" // This should win (highest priority)
        width={150}
        height={100}
        position={[500, 180]}
    />
)

// Example 6: Nested boxes with different styles
const example6 = (
    <Box
        width={200}
        height={200}
        backgroundColor="#e0e0e0"
        padding={20}
        borderRadius={15}
        position={[480, 360]}
    >
        <Box
            className="bg-red"
            width={60}
            height={60}
            position={[10, 10]}
            borderRadius={5}
        />
        <Box
            style={{ backgroundColor: '#00ff00' }}
            width={60}
            height={60}
            position={[80, 10]}
            borderRadius={5}
        />
        <Box
            backgroundColor="#0000ff"
            width={60}
            height={60}
            position={[10, 80]}
            borderRadius={5}
        />
    </Box>
)

// Render all examples
renderer.render(
    <>
        {example1}
        {example2}
        {example3}
        {example4}
        {example5}
        {example6}
    </>
)

console.log('Box component example rendered!')
console.log('Scene children count:', renderer.scene.children.length)
console.log('Examples:')
console.log('1. Red box with border radius (direct CSS props)')
console.log('2. Blue box with Tailwind classes (twrn)')
console.log('3. Green box with style prop and shadow')
console.log('4. Gray container with flexbox layout (3 colored boxes)')
console.log('5. Priority test (should be red)')
console.log('6. Nested boxes with different style sources')
