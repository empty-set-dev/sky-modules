import './_Systems'
import globalify from 'sky/helpers/globalify'

declare global {
    class Entity extends lib.Entity {
        removeComponent(name: string): void
    }
}

namespace lib {
    export class Entity extends Effect {
        onSystemsContext(): Destructor {
            this['__components'].forEach(component => {
                this['__onAddComponent'](component.constructor.name)
            })

            return () => {
                this['__systems'].forEach(([system, k]) => {
                    const { Components } = system.constructor as SystemConstructor
                    Components[k].remove(this.constructor)
                })
                this['__systems'] = []
            }
        }

        removeComponent(name: string): void {
            this.__components.remove(this[name as keyof Entity])
            delete this[name as keyof Entity]

            if (!this.hasContext(Systems)) {
                return
            }

            const systemsMap = this.context(Systems)['__systemsMap']

            if (!systemsMap[name]) {
                return
            }

            this.__systems.forEach(([system, k]) => {
                const { Components } = system.constructor as SystemConstructor
                Components[k].remove(this)
            })
            this.__systems = []

            this.__components.forEach(component => {
                this.__onAddComponent(component.constructor.name)
            })
        }

        private __onAddComponent(name: string): void {
            if (!this.hasContext(Systems)) {
                return
            }

            const systemsMap = this.context(Systems)['__systemsMap']

            if (!systemsMap[name]) {
                return
            }

            systemsMap[name].forEach(system => {
                const { Components } = system.constructor as SystemConstructor
                Object.keys(Components).forEach(k => {
                    const Components = Components[k]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (
                        Components.every((Component: any) => this[Component.name as keyof Entity])
                    ) {
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
}

globalify(lib)
