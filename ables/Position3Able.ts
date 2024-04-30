import 'features/ecs'
import Vector3 from 'math/Vector3'

interface Position3Able extends Component, Vector3 {}
const Position3Able = Fc<Position3Able, [entity: Entity, x?: number, y?: number, z?: number]>(
    (entity: Entity, x?: number, y?: number, z?: number) => {
        Fc.super(Component, entity)
        Fc.super(Vector3, x, y, z)
    }
)

export default Position3Able
