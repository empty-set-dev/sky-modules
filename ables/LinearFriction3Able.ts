import 'features/ecs'

interface LinearFriction3Able extends Component {
    amount: number
}
const LinearFriction3Able = Fc(
    (entity: Entity, friction = percents(50)): as<LinearFriction3Able> => {
        Fc.super(Component, entity)

        Fc.public(() => {
            amount
        })

        const amount = friction
    }
)

export default LinearFriction3Able
