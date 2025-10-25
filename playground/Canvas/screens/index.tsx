import '@sky-modules/canvas/jsx.global'

import { BasicMaterial, RectGeometry } from '@sky-modules/Canvas/jsx'
import { JSX } from 'sky-jsx'

export default function IndexScreen(): JSX.Element {
    return (
        <Mesh position={[100, 100]}>
            <BasicMaterial color="#FF99FF" />
            <RectGeometry width={100} height={100} />
        </Mesh>
    )
}
