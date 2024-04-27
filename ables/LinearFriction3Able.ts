import 'features/ecs'

interface LinearFriction3Able extends Component {
    amount: number
}
const LinearFriction3Able = Fc<LinearFriction3Able, [friction?: percents]>(
    (friction = percents(50)) => {
        Fc.super(Component)

        Fc.public(() => {
            amount
        })

        const amount = friction
    }
)

export default LinearFriction3Able
