import 'features/ecs/global'

export default class Friction3Able extends Component {
    friction: MetersPerSecond

    constructor(entity: Entity, friction: MetersPerSecond) {
        super(entity)

        this.friction = friction
    }
}
