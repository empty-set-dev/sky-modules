import 'features/Fc.global'
import { Vector3 } from 'three/src/Three'

interface Position3Able extends Component, Vector3 {}
const Position3Able = Fc<Position3Able, [x?: number, y?: number, z?: number]>(
    (x?: number, y?: number, z?: number) => {
        Fc.super(Component)
        Fc.super(Vector3, x, y, z)
    }
)

export default Position3Able
