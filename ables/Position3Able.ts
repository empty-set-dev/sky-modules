import 'sky/features/ecs/global'
import Vector3 from 'sky/math/Vector3'

export default class Position3Able extends Component {
    position: Vector3

    constructor(entity: Entity, x?: number, y?: number, z?: number) {
        super(entity)

        this.position = new Vector3(x, y, z)
    }
}
