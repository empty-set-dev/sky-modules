import './_Entity'
import globalify from 'sky/utilities/globalify'

declare global {
    class Component {
        constructor(entity: Entity)
    }
}

class Component {
    constructor(entity: Entity) {
        const { name } = this.constructor

        const entityWithComponent = entity as never as { [x: string]: Component } & Entity

        if (entityWithComponent[name]) {
            entity.removeComponent(name)
        }

        entityWithComponent[name] = this
        entity['__components'].push(this)
        entity['__onAddComponent'](name)
    }
}

globalify({ Component })
