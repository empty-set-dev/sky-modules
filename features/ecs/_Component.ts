import globalify from 'sky/utilities/globalify'

declare global {
    class Component extends lib.Component {}
}

namespace lib {
    export class Component {
        entity: Entity

        constructor(entity: Entity) {
            this.entity = entity
        }
    }
}

globalify(lib)
