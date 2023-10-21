import 'features/Fc.global'

interface LinearFriction3Able extends Component {
    value: number
}
const LinearFriction3Able = Fc<LinearFriction3Able, [friction?: percents]>(
    (friction = percents(50)) => {
        Fc.super(Component)

        Fc.public(() => {
            value
        })

        const value = friction
    }
)

export default LinearFriction3Able
