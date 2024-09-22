import './_Entity'
import globalify from 'sky/helpers/globalify'

declare global {
    class Component {
        constructor(entity: Entity)
    }
}

class Component {
    constructor(entity: Entity) {
        const { name } = this.constructor

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entityAsAny = entity as any

        if (entityAsAny[name]) {
            entityAsAny.removeComponent(name)
            entityAsAny['__components'].remove(this)
        }

        entityAsAny[name] = this
        entityAsAny['__components'].push(this)
        entityAsAny['__onAddComponent'](name)
    }
}

globalify({ Component })
