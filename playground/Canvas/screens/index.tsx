import '@sky-modules/canvas/jsx.global'

import { RectGeometry, BasicMaterial, Mesh } from '@sky-modules/Canvas/jsx'
import { createSignal, JSX } from 'sky-jsx'

export default function IndexScreen(): JSX.Element {
    const [x, setX] = createSignal(0)

    function updateRect(_: Mesh, __: number, dt: number): void {
        setX(x() + dt)
        console.log('set x')
    }

    console.log(x())

    return (
        <>
            <Mesh position={[100, x()]} onUpdate={updateRect}>
                <BasicMaterial color="#FF99FF" />
                <RectGeometry width={100} height={100} />
            </Mesh>
        </>
    )
}
