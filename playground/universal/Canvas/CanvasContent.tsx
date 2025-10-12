import { BasicMaterial, GradientMaterial, Mesh, Scene, StrokeGradientMaterial } from '@sky-modules/Canvas/jsx'
import { CircleGeometry } from '@sky-modules/canvas/jsx'
import { useCanvasContext } from '@sky-modules/canvas/jsx'
import JSX from 'sky-jsx'

export default function CanvasContent(): JSX.Return {
    const { drawContext } = useCanvasContext()
    const gradient = drawContext.createConicGradient(0, 50, 50) // Центр градиента в (50, 50)
    // Add five color stops
    gradient.addColorStop(0, 'red')
    gradient.addColorStop(0.25, 'orange')
    gradient.addColorStop(0.5, 'yellow')
    gradient.addColorStop(0.75, 'green')
    gradient.addColorStop(1, 'blue')

    return (
        <Scene>
            <Mesh>
                <CircleGeometry radius={50} x={50} y={50} />
                <StrokeGradientMaterial gradient={gradient} lineWidth={10} />
            </Mesh>
        </Scene>
    )
}
