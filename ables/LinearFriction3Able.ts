import 'sky/features/ecs/global'

export default class LinearFriction3Able extends Component {
    linearFriction: PercentsPerSecond

    constructor(entity: Entity, linearFriction = PercentsPerSecond(99)) {
        super(entity)

        this.linearFriction = linearFriction
    }
}
