import 'features/ecs'

interface Friction3Able extends Component {
    amount: number
}
const Friction3Able = Fc<Friction3Able, [entity: Entity, friction?: number]>(
    (entity: Entity, friction: number = 1) => {
        Fc.super(Component, entity)

        Fc.public(() => {
            amount
        })

        const amount = friction
    }
)

export default Friction3Able
