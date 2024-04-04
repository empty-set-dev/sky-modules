import 'features/Fc/global'

interface LinearFriction3Able extends Component {
    force: number
}
const LinearFriction3Able = Fc<LinearFriction3Able, [friction?: percents]>(
    (friction = percents(50)) => {
        Fc.super(Component)

        Fc.public(() => {
            force
        })

        const force = friction
    }
)

export default LinearFriction3Able
