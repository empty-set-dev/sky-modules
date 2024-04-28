import './global'

class Player extends Link {
    constructor(...parents: Parent[]) {
        super(...parents)

        new Timeout(
            this,
            () => {
                // eslint-disable-next-line no-console
                console.log('Player')
            },
            1000
        )
    }
}

const root = new Root()
new Player(root)
