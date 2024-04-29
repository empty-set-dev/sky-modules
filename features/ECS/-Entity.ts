import './-Systems'
import globalify from 'helpers/globalify'

import { __SYSTEMS } from './__'

declare global {
    class Entity {
        readonly link

        constructor(link: Link)
    }
}

class Entity extends Link {
    constructor(parent: Parent) {
        super(parent)

        this[__SYSTEMS] = parent[__SYSTEMS]
    }
}

globalify({ Entity })
