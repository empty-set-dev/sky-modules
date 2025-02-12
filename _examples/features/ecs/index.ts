import 'sky/platform/node/global'
import Physics3System from 'sky/#ecs-systems/Physics3System'

class App extends EffectsRoot {
    systems: Systems

    constructor() {
        super()

        this.systems = new Systems(this, [new Physics3System()])
    }
}

new App()
