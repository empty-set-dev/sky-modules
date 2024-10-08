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
                    const systemWithEntities = system as {
                        [x: string]: Entity[]
                    }

                    systemWithEntities[k].remove(this)
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

            for (let i = this.__systems.length - 1; i >= 0; --i) {
                const [system, k] = this.__systems[i]

                const systemWithEntities = system as {
                    [x: string]: Entity[]
                }

                const Components = (system.constructor as SystemConstructor).Entities[k]
                Components.some(Component => {
                    if (Component.name === name) {
                        systemWithEntities[k].remove(this)
                        this.__systems.splice(i, 1)
                        return true
                    }

                    return false
                })
            }
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
                const { Entities } = system.constructor as SystemConstructor
                Object.keys(Entities).forEach(k => {
                    const Components = Entities[k]
                    if (Components.every(Component => this[Component.name as keyof Entity])) {
                        const systemWithEntities = system as {
                            [x: string]: Entity[]
                        }
                        const systemWithOnAdd = system as {
                            [y: string]: (entity: Entity) => void
                        }
                        systemWithEntities[k] ??= []
                        if (!this['__systems'].find(set => set[0] === system)) {
                            this['__systems'].push([system, k])
                            systemWithEntities[k].push(this)
                            const onAdd = `onAdd${k[0].toUpperCase() + k.slice(1)}`
                            systemWithOnAdd[onAdd] && systemWithOnAdd[onAdd](this)
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
