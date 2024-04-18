import 'features/ecs'
import Vector3 from 'math/Vector3'

interface Move3Able extends Component, Vector3 {}
const Move3Able = Fc<Move3Able, [x?: number, y?: number, z?: number]>(
    (x?: number, y?: number, z?: number) => {
        Fc.super(Component)
        Fc.super(Vector3, x, y, z)
    }
)

export default Move3Able
