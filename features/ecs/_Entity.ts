import './_Systems'
import globalify from 'sky/helpers/globalify'

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
        this['__components'].remove(this[name as keyof Entity] as unknown)
        delete this[name as keyof Entity]

        if (!this.hasContext(Systems)) {
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const systemsMap = (this.context(Systems) as any)['__systemsMap']

        if (!systemsMap[name]) {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const systemsRecord = (this.context(Systems) as any)['__systemsMap']

        if (!systemsRecord[name]) {
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        systemsRecord[name].forEach((system: any) => {
            Object.keys(system.constructor.Components).forEach(k => {
                const Components = system.constructor.Components[k]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (Components.every((Component: any) => this[Component.name as keyof Entity])) {
                    system[k] ??= []
                    if (!this['__systems'].includes(system)) {
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
