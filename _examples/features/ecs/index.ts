import 'sky/platform/node/global'
import 'sky/math/global'
import 'sky/utilities/global'
import 'sky/helpers/global'
import 'sky/features/effect/global'
import 'sky/features/ecs/global'
import 'sky/ecs-components/global'
import 'sky/ecs-systems/global'

class App {
    root = new EffectsRoot()
    systems: Systems

    constructor() {
        this.systems = new Systems(this.root)
        this.root.addContext(this.systems)
    }
}

const app = new App()

declare global {
    interface Entity {
        some: { x: number; y: number }
    }
}
class Some {
    x: number = 42
    y: number = 19
}
defineComponent('some', Some)

const player = new Entity(app.root)
player.physics3.position = new Vector3(0, 0, 0)
