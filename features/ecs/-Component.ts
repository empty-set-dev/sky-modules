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

        if (entity[name]) {
            entity.removeComponent(name)
        }

        entity[name] = this
        entity['__onAddComponent'](name)
    }
}

globalify({ Component })
