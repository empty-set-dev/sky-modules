import { BasicMaterial, Mesh, Scene, StrokeGradientMaterial } from '@sky-modules/Canvas/jsx'
import { CircleGeometry } from '@sky-modules/canvas/jsx'
import { useCanvasContext } from '@sky-modules/canvas/jsx'
import JSX from 'sky-jsx'

export default function CanvasContent(): JSX.Return {
    const { drawContext } = useCanvasContext()
    const gradient = drawContext.createConicGradient(0, 0, 100)
    gradient.addColorStop(0, '#FF0000')
    gradient.addColorStop(0.5, '#FFFF00')
    gradient.addColorStop(1, '#00FFFF')

    return (
        <Scene>
            <Mesh>
                <CircleGeometry radius={20} x={50} y={50} />
                <StrokeGradientMaterial gradient={gradient} lineWidth={10} />
                {/* <BasicMaterial color="#00FFFF" /> */}
            </Mesh>
        </Scene>
    )
}
