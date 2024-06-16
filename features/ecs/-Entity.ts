import './-Systems'
import globalify from 'sky/helpers/globalify'

import { __SYSTEMS_RECORD } from './__'

declare global {
    function entity(constructor: Function): void

    class Entity extends Effect {
        removeComponent(name: string): void
    }
}

function entity(constructor: { new (...args: unknown[]): {} }): unknown {
    return effect(constructor)
}

class Entity extends Effect {
    onSystemsContext(): Destructor {
        this['__components'].forEach(component => {
            this['__onAddComponent'](component.constructor.name)
        })

        return () => {
            this['__systems'].forEach(([system, k]) => {
                const Components = (system.constructor as SystemConstructor).Components
                Components[k].remove(this)
            })
            this['__systems'] = []
        }
    }

    removeComponent(name: string): void {
        this['__components'].remove(this[name])
        delete this[name]

        if (!this.hasContext(Systems)) {
            return
        }

        const systemsRecord = this.context(Systems)[__SYSTEMS_RECORD]

        if (!systemsRecord[name]) {
            return
        }

        this['__systems'].forEach(([system, k]) => {
            const Components = (system.constructor as SystemConstructor).Components
            Components[k].remove(this)
        })
        this['__systems'] = []

        this['__components'].forEach(component => {
            this['__onAddComponent'](component.constructor.name)
        })
    }

    private __onAddComponent(name: string): void {
        if (!this.hasContext(Systems)) {
            return
        }

        const systemsRecord = this.context(Systems)[__SYSTEMS_RECORD]

        if (!systemsRecord[name]) {
            return
        }

        systemsRecord[name].forEach(system => {
            Object.keys(system.constructor.Components).forEach(k => {
                const Components = system.constructor.Components[k]
                if (Components.every(Component => this[Component.name])) {
                    system[k] ??= []
                    if (!this['__systems'].includes[system]) {
                        this['__systems'].push([system, k])
                        system[k].push(this)
                        const onAdd = `onAdd${k[0].toUpperCase() + k.slice(1)}`
                        system[onAdd] && system[onAdd](this)
                    }
                }
            })
        })
    }

    private __components: Component[] = []
    private __systems: [System, string][] = []
}

globalify({ entity, Entity })
