import 'features/ecs/global'

export default class LinearFriction3Able extends Component {
    linearFriction: percentsPerSecond

    constructor(entity: Entity, linearFriction = percentsPerSecond(50)) {
        super(entity)

        this.linearFriction = linearFriction
    }
}
