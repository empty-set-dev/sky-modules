import 'sky/features/ecs/global'

export default class LinearFriction3Able extends Component {
    linearFriction: PercentsPerMillisecond

    /**
     * @param {Entity} entity
     * @param {PercentsPerMillisecond} linearFriction
     */
    constructor(entity: Entity, linearFriction = PercentsPerMillisecond(50)) {
        super(entity)

        this.linearFriction = linearFriction
    }
}
