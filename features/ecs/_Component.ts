import globalify from 'sky/utilities/globalify'

declare global {
    class Component extends module.Component {}
}

namespace module {
    export class Component {
        entity!: Entity
    }
}

globalify(module)
