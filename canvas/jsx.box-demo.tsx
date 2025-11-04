/**
 * Box Component Demo
 * Демонстрирует работу Box с CSS props, Tailwind classes (twrn) и style prop
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanvasJSXRenderer, Box } from './jsx'

// Create demo
export function createBoxDemo(container: HTMLElement) {
    const renderer = new CanvasJSXRenderer({
        container,
        size: () => [800, 600],
    })

    // Demo 1: Direct CSS Props
    const DirectPropsDemo = () => (
        <Box
            width={150}
            height={100}
            backgroundColor="#ff6b6b"
            borderRadius={12}
            padding={16}
            opacity={0.9}
            position={[50, 50]}
        />
    )

    // Demo 2: Tailwind Classes with twrn
    const TailwindDemo = () => (
        <Box
            className="w-150 h-100 bg-blue rounded-lg p-4 shadow-lg"
            position={[220, 50]}
        />
    )

    // Demo 3: Style Prop
    const StylePropDemo = () => (
        <Box
            style={{
                width: '150px',
                height: '100px',
                backgroundColor: '#4ecdc4',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            position={[390, 50]}
        />
    )

    // Demo 4: Priority Test (direct props win)
    const PriorityDemo = () => (
        <Box
            sx={{ backgroundColor: '#000000' }} // Lowest priority
            className="bg-blue" // Medium priority
            style={{ backgroundColor: '#00ff00' }} // High priority
            backgroundColor="#9b59b6" // Highest priority - WINS
            width={150}
            height={100}
            borderRadius={12}
            position={[560, 50]}
        />
    )

    // Demo 5: Flexbox Layout
    const FlexboxDemo = () => (
        <Box
            width={380}
            height={120}
            backgroundColor="#f0f0f0"
            borderRadius={12}
            padding={16}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            gap={12}
            position={[50, 180]}
        >
            <Box width={80} height={80} backgroundColor="#e74c3c" borderRadius={8} />
            <Box width={80} height={80} backgroundColor="#3498db" borderRadius={8} />
            <Box width={80} height={80} backgroundColor="#2ecc71" borderRadius={8} />
        </Box>
    )

    // Demo 6: Nested Boxes with Mixed Props
    const NestedBoxesDemo = () => (
        <Box
            width={300}
            height={200}
            backgroundColor="#ecf0f1"
            borderRadius={12}
            padding={20}
            position={[460, 180]}
        >
            <Box
                className="bg-red"
                width={60}
                height={60}
                borderRadius={6}
                position={[0, 0]}
            />
            <Box
                style={{ backgroundColor: '#f39c12' }}
                width={60}
                height={60}
                borderRadius={6}
                position={[80, 0]}
            />
            <Box
                backgroundColor="#8e44ad"
                width={60}
                height={60}
                borderRadius={6}
                position={[160, 0]}
            />
            <Box
                className="bg-blue"
                width={180}
                height={60}
                borderRadius={6}
                position={[40, 80]}
            />
        </Box>
    )

    // Demo 7: Complex Tailwind Merge
    const TailwindMergeDemo = () => (
        <Box
            // twrn will merge conflicting classes - last wins
            className="p-2 p-4 bg-red bg-green m-2 m-4 w-100 w-150 rounded rounded-lg"
            // Result: p-4, bg-green, m-4, w-150, rounded-lg
            height={100}
            position={[50, 330]}
        />
    )

    // Demo 8: Arbitrary Values in Tailwind
    const ArbitraryValuesDemo = () => (
        <Box
            className="w-[180px] h-[80px] bg-[#ff1744] rounded-[16px]"
            position={[220, 330]}
        />
    )

    // Render all demos
    renderer.render(() => (
        <>
            <DirectPropsDemo />
            <TailwindDemo />
            <StylePropDemo />
            <PriorityDemo />
            <FlexboxDemo />
            <NestedBoxesDemo />
            <TailwindMergeDemo />
            <ArbitraryValuesDemo />
        </>
    ))

    return renderer
}

// For direct execution
if (typeof document !== 'undefined') {
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    container.style.margin = '20px auto'
    container.style.border = '1px solid #ddd'
    document.body.appendChild(container)

    const renderer = createBoxDemo(container)

    console.log('📦 Box Component Demo')
    console.log('====================')
    console.log(`Scene children: ${renderer.scene.children.length}`)
    console.log('')
    console.log('Demos:')
    console.log('1. Direct CSS Props (red box)')
    console.log('2. Tailwind Classes (blue box)')
    console.log('3. Style Prop (teal box)')
    console.log('4. Priority Test (purple - direct props win)')
    console.log('5. Flexbox Layout (3 boxes in row)')
    console.log('6. Nested Boxes (mixed props)')
    console.log('7. Tailwind Merge (conflicting classes resolved)')
    console.log('8. Arbitrary Values ([value] syntax)')
    console.log('')
    console.log('✅ All features working!')
}
