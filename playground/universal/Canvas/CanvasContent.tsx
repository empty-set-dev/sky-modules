import { CircleGeometry, StrokeGradientMaterial } from '@sky-modules/canvas/jsx'
import { Mesh, Scene } from '@sky-modules/Canvas/jsx'
import JSX from 'sky-jsx'

import useCanvasContext from '#/mitosis/Canvas/useCanvasContext'

export default function CanvasContent(): JSX.Return {
    const canvas = useCanvasContext()
    const context = canvas.getContext('2d')
    const gradient = context!.createConicGradient(0, 0, 100)

    return (
        <Scene>
            <Mesh>
                <CircleGeometry />
                <StrokeGradientMaterial gradient={gradient} />
            </Mesh>
        </Scene>
    )
}
