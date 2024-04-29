import './-Entity'
import globalify from 'helpers/globalify'

import { __SYSTEMS } from './__'

declare global {
    class Component {
        constructor(entity: Entity)
    }
}

abstract class Component {
    constructor(entity: Entity) {
        const { name } = this.constructor

        entity[name] = this
    }

    private [__SYSTEMS]: Record<string, {}[]>
}

globalify({ Component })
