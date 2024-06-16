import './-Entity'
import globalify from 'sky/helpers/globalify'

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
            entity['__components'].remove(this)
        }

        entity[name] = this
        entity['__components'].push(this)
        entity['__onAddComponent'](name)
    }
}

globalify({ Component })
