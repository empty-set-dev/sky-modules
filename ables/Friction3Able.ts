import 'features/ecs/global'

export default class Friction3Able extends Component {
    friction: number

    constructor(entity: Entity, friction: number = 1) {
        super(entity)

        this.friction = friction
    }
}
