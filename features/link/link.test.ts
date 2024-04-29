import './global'

class App extends Root {
    static context = Symbol('AppContext')

    foo = 42

    constructor() {
        super()

        this.destroy = (): void => {
            // eslint-disable-next-line no-console
            console.log('app destroyed')
        }
    }
}

class Player extends Link {
    constructor(parent: Parent) {
        super(parent)

        new Timeout(
            () => {
                // eslint-disable-next-line no-console
                console.log('Player')
            },
            1000,
            [this, App]
        )

        this.destroy = (): void => {
            // eslint-disable-next-line no-console
            console.log('player destroyed')
        }
    }
}

const app = new App()
new Player(app).destroy()
