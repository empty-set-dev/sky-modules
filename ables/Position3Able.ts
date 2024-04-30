import 'features/ecs'
import Vector3 from 'math/Vector3'

interface Position3Able extends Component, Vector3 {}
const Position3Able = Fc(
    (entity: Entity, x?: number, y?: number, z?: number): as<Position3Able> => {
        Fc.super(Component, entity)
        Fc.super(Vector3, x, y, z)
    }
)

export default Position3Able
