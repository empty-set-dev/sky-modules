import 'sky/features/ecs/global'

export default class Friction3Able extends Component {
    friction: MetersPerSecond

    /**
     * @param {Entity} entity
     * @param {MetersPerSecond} friction
     */
    constructor(entity: Entity, friction: MetersPerSecond) {
        super(entity)

        this.friction = friction
    }
}
