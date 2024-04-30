import 'features/ecs'
import Vector3 from 'math/Vector3'

interface Move3Able extends Component, Vector3 {}
const Move3Able = Fc((entity: Entity, x?: number, y?: number, z?: number): as<Move3Able> => {
    Fc.super(Component, entity)
    Fc.super(Vector3, x, y, z)
})

export default Move3Able
