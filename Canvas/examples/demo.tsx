import Canvas, { CanvasParameters } from '../Canvas'
import { CanvasJSXRenderer } from '../jsx'
import Box from '../Box'

// Example 1: Basic shapes with lowercase JSX
export function BasicShapesExample() {
    const canvasParams: CanvasParameters = {
        size: () => [800, 600],
        pixelRatio: window.devicePixelRatio
    }

    // Create canvas instance
    const canvas = new Canvas({} as any, canvasParams)
    const renderer = new CanvasJSXRenderer(canvas)

    // Render JSX
    const jsx = (
        <canvas width={800} height={600}>
            {/* Rectangle with Tailwind-style props */}
            <rect
                x="50"
                y="50"
                w="100"
                h="80"
                fill="blue.500"
                rounded="8"
            />

            {/* Circle with color */}
            <circle
                x="250"
                y="100"
                r="40"
                fill="red.400"
                stroke="red.600"
                borderWidth="2"
            />

            {/* Text element */}
            <text
                x="400"
                y="100"
                fontSize="24"
                color="green.600"
                fontFamily="Arial"
            >
                Hello Canvas JSX!
            </text>

            {/* Line */}
            <line
                x1="50"
                y1="200"
                x2="350"
                y2="200"
                stroke="purple.500"
                strokeWidth="3"
            />

            {/* Ellipse */}
            <ellipse
                cx="500"
                cy="250"
                rx="60"
                ry="30"
                fill="yellow.400"
                stroke="orange.500"
            />
        </canvas>
    )

    renderer.render(jsx)
    return { canvas, renderer }
}

// Example 2: Box component with asChild
export function BoxComponentExample() {
    const canvasParams: CanvasParameters = {
        size: () => [800, 600]
    }

    const canvas = new Canvas({} as any, canvasParams)
    const renderer = new CanvasJSXRenderer(canvas)

    const jsx = (
        <canvas width={800} height={600}>
            {/* Box with asChild - applies styles to rect */}
            <Box w="120" h="80" x="100" y="100" bg="blue.500" rounded="12" asChild>
                <rect />
            </Box>

            {/* Box with asChild - applies styles to circle */}
            <Box r="50" x="350" y="150" fill="green.400" border="2px solid green.600" asChild>
                <circle />
            </Box>

            {/* Box without asChild - renders as rect */}
            <Box w="80" h="60" x="500" y="120" bg="purple.500" />

            {/* Nested styling */}
            <Box x="200" y="300" asChild>
                <group>
                    <Box w="40" h="40" bg="red.500" asChild>
                        <rect />
                    </Box>
                    <Box w="40" h="40" x="50" bg="yellow.500" asChild>
                        <rect />
                    </Box>
                    <Box w="40" h="40" x="100" bg="blue.500" asChild>
                        <rect />
                    </Box>
                </group>
            </Box>
        </canvas>
    )

    renderer.render(jsx)
    return { canvas, renderer }
}

// Example 3: Animation with onUpdate
export function AnimationExample() {
    const canvasParams: CanvasParameters = {
        size: () => [800, 600]
    }

    const canvas = new Canvas({} as any, canvasParams)
    const renderer = new CanvasJSXRenderer(canvas)

    const jsx = (
        <canvas width={800} height={600}>
            {/* Rotating rectangle */}
            <Box
                w="60"
                h="60"
                x="200"
                y="200"
                bg="blue.500"
                asChild
                onUpdate={(element, time) => {
                    element.rotate = time * 45 // 45 degrees per second
                }}
            >
                <rect />
            </Box>

            {/* Bouncing circle */}
            <Box
                r="30"
                x="400"
                y="300"
                fill="red.400"
                asChild
                onUpdate={(element, time) => {
                    element.y = 300 + Math.sin(time * 2) * 50
                }}
            >
                <circle />
            </Box>

            {/* Pulsing text */}
            <text
                x="500"
                y="200"
                fontSize="20"
                color="green.600"
                onUpdate={(element, time) => {
                    element.fontSize = 20 + Math.sin(time * 3) * 5
                }}
            >
                Animated Text!
            </text>

            {/* Color changing circle */}
            <circle
                x="600"
                y="400"
                r="25"
                onUpdate={(element, time) => {
                    const hue = (time * 100) % 360
                    element.fill = `hsl(${hue}, 70%, 50%)`
                }}
            />
        </canvas>
    )

    renderer.render(jsx)
    return { canvas, renderer }
}

// Example 4: Complex scene with grouping
export function ComplexSceneExample() {
    const canvasParams: CanvasParameters = {
        size: () => [800, 600]
    }

    const canvas = new Canvas({} as any, canvasParams)
    const renderer = new CanvasJSXRenderer(canvas)

    const jsx = (
        <canvas width={800} height={600}>
            {/* Background */}
            <rect w="800" h="600" fill="#1a1a2e" />

            {/* Sun */}
            <group x="650" y="100">
                <circle r="40" fill="yellow.400" />
                <circle r="35" fill="yellow.300" />
            </group>

            {/* Mountains */}
            <group y="400">
                <rect x="0" y="0" w="200" h="200" fill="gray.600" />
                <rect x="150" y="50" w="250" h="150" fill="gray.700" />
                <rect x="350" y="30" w="180" h="170" fill="gray.500" />
            </group>

            {/* Trees */}
            <group x="100" y="350">
                {/* Tree 1 */}
                <rect x="0" y="30" w="10" h="40" fill="#8B4513" />
                <circle x="5" y="20" r="15" fill="green.600" />

                {/* Tree 2 */}
                <rect x="50" y="25" w="12" h="45" fill="#8B4513" />
                <circle x="56" y="15" r="18" fill="green.500" />

                {/* Tree 3 */}
                <rect x="100" y="35" w="8" h="35" fill="#8B4513" />
                <circle x="104" y="25" r="12" fill="green.700" />
            </group>

            {/* House */}
            <group x="400" y="300">
                {/* House base */}
                <Box w="100" h="80" bg="red.600" stroke="red.800" borderWidth="2" asChild>
                    <rect />
                </Box>

                {/* Roof */}
                <rect x="10" y="-20" w="80" h="30" fill="gray.800" />

                {/* Door */}
                <Box w="20" h="40" x="40" y="40" bg="brown" asChild>
                    <rect />
                </Box>

                {/* Windows */}
                <Box w="15" h="15" x="20" y="25" bg="blue.200" asChild>
                    <rect />
                </Box>
                <Box w="15" h="15" x="65" y="25" bg="blue.200" asChild>
                    <rect />
                </Box>
            </group>

            {/* Moving clouds */}
            <group
                y="50"
                onUpdate={(element, time) => {
                    element.x = ((time * 20) % 900) - 100
                }}
            >
                <ellipse cx="100" cy="0" rx="30" ry="15" fill="white" opacity={0.8} />
                <ellipse cx="120" cy="-5" rx="25" ry="12" fill="white" opacity={0.8} />
                <ellipse cx="140" cy="0" rx="20" ry="10" fill="white" opacity={0.8} />
            </group>

            {/* Title */}
            <text
                x="400"
                y="50"
                fontSize="32"
                color="white"
                textAlign="center"
                fontWeight="bold"
            >
                Canvas JSX Demo
            </text>
        </canvas>
    )

    renderer.render(jsx)
    return { canvas, renderer }
}

// Example 5: Responsive design with different props
export function ResponsiveExample() {
    const canvasParams: CanvasParameters = {
        size: () => [800, 600]
    }

    const canvas = new Canvas({} as any, canvasParams)
    const renderer = new CanvasJSXRenderer(canvas)

    // Different props based on canvas size
    const isSmall = canvas.size()[0] < 600

    const jsx = (
        <canvas width={800} height={600}>
            {/* Responsive box */}
            <Box
                w={isSmall ? "80" : "120"}
                h={isSmall ? "60" : "90"}
                x="100"
                y="100"
                bg={isSmall ? "red.500" : "blue.500"}
                fontSize={isSmall ? "14" : "18"}
                asChild
            >
                <rect />
            </Box>

            {/* Responsive text */}
            <text
                x="300"
                y="150"
                fontSize={isSmall ? "16" : "24"}
                color="green.600"
            >
                {isSmall ? "Small Screen" : "Large Screen"}
            </text>

            {/* Grid of responsive circles */}
            <group x="400" y="200">
                {Array.from({ length: 9 }, (_, i) => {
                    const col = i % 3
                    const row = Math.floor(i / 3)
                    const size = isSmall ? 20 : 30
                    const spacing = isSmall ? 40 : 60

                    return (
                        <Box
                            key={i}
                            r={size.toString()}
                            x={(col * spacing).toString()}
                            y={(row * spacing).toString()}
                            fill={`hsl(${i * 40}, 70%, 50%)`}
                            asChild
                        >
                            <circle />
                        </Box>
                    )
                })}
            </group>
        </canvas>
    )

    renderer.render(jsx)
    return { canvas, renderer }
}

// Usage helper function
export function createCanvasJSXDemo(containerId: string) {
    const container = document.getElementById(containerId)
    if (!container) {
        console.error(`Container with id "${containerId}" not found`)
        return
    }

    // Run basic example
    const { canvas, renderer } = BasicShapesExample()

    // Append canvas to container
    container.appendChild(canvas.domElement)

    // Cleanup function
    return () => {
        renderer.dispose()
        container.removeChild(canvas.domElement)
    }
}

export default {
    BasicShapesExample,
    BoxComponentExample,
    AnimationExample,
    ComplexSceneExample,
    ResponsiveExample,
    createCanvasJSXDemo
}