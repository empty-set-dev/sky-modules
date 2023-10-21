import 'features/Fc.global'

interface Friction3Able extends Component {
    value: number
}
const Friction3Able = Fc<Friction3Able, [friction?: number]>((friction: number = 1) => {
    Fc.super(Component)

    Fc.public(() => {
        value
    })

    const value = friction
})

export default Friction3Able
