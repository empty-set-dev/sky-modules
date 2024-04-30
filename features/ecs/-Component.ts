import './-Entity'
import globalify from 'helpers/globalify'

import { __SYSTEMS_RECORD } from './__'

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

    private [__SYSTEMS_RECORD]: Record<string, {}[]>
}

globalify({ Component })
