import 'features/ecs/global'

export default class LinearFriction3Able extends Component {
    friction: percents

    constructor(entity: Entity, friction = percentsPerSecond(50)) {
        super(entity)

        this.friction = friction
    }
}
