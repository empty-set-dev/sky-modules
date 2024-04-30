import 'features/ecs/global'

interface Friction3Able extends Component {
    amount: number
}
const Friction3Able = Fc(function (this: Friction3Able, entity: Entity, friction: number = 1) {
    Fc.super(Component, entity)

    Fc.public(() => {
        amount
    })

    const amount = friction
})

export default Friction3Able
