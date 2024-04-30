import 'features/ecs'

interface Friction3Able extends Component {
    amount: number
}
const Friction3Able = Fc((entity: Entity, friction: number = 1): as<Friction3Able> => {
    Fc.super(Component, entity)

    Fc.public(() => {
        amount
    })

    const amount = friction
})

export default Friction3Able
