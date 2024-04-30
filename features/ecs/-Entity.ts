import './-Systems'
import globalify from 'helpers/globalify'

import { __SYSTEMS } from './__'

declare global {
    class Entity extends Link {
        constructor(parent: Parent)
    }
}

class Entity extends Link {
    constructor(parent: Parent) {
        super(parent)

        this[__SYSTEMS] = parent[__SYSTEMS]
    }

    private __addComponent(name: string): void {
        const systems = this[__SYSTEMS]

        if (!systems[name]) {
            return
        }

        systems[name].forEach(system => {
            Object.keys(system.constructor.Components).forEach(k => {
                const Components = system.constructor.Components[k]
                if (Components.every(Component => this[Component.name])) {
                    system[k] ??= []
                    if (!system[k].includes(this)) {
                        system[k].push(this)
                        const onAdd = `onAdd${k[0].toUpperCase() + k.slice(1)}`
                        system[onAdd] && system[onAdd](this)
                    }
                }
            })
        })
    }

    private __removeComponent(name: string): void {
        //
    }
}

globalify({ Entity })
