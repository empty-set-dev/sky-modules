import 'features/ecs/global'
import Vector3 from 'math/Vector3'

export default class Acceleration3Able extends Component {
    acceleration: Vector3

    constructor(entity: Entity, x?: number, y?: number, z?: number) {
        super(entity)

        this.acceleration = new Vector3(x, y, z)
    }
}
