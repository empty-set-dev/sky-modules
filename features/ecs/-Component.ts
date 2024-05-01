import './-Entity'
import globalify from 'helpers/globalify'

declare global {
    class Component {
        constructor(entity: Entity)
    }
}

class Component {
    constructor(entity: Entity) {
        const { name } = this.constructor

        entity[name] = this
    }
}

globalify({ Component })
