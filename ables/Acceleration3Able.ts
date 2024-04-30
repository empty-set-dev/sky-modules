import 'features/ecs'
import Vector3 from 'math/Vector3'

interface Acceleration3Able extends Component, Vector3 {}
const Acceleration3Able = Fc(function (
    this: Acceleration3Able,
    entity: Entity,
    x?: number,
    y?: number,
    z?: number
) {
    Fc.super(Component, entity)
    Fc.super(Vector3, x, y, z)
})

export default Acceleration3Able
