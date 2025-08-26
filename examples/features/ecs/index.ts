import './imports'

class App {
    root = new EffectsRoot()
    systems: Systems

    constructor() {
        this.systems = new Systems(this.root)
        this.root.addContext(this.systems)
    }
}

const app = new App()
const player = new Entity(app.root)
player.physics3.position = new Vector3(0, 0, 0)
player.physics3.velocity = new Vector3(0, 0, 1)

app.root.registerEmitUpdate(null, () => {
    // eslint-disable-next-line no-console
    console.log(player.physics3.position)
})
