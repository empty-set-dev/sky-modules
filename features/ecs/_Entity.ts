import './_Systems'
import globalify from 'sky/utilities/globalify'

declare global {
    class Entity extends lib.Entity {}
}

namespace lib {
    export class Entity {
        readonly effect: Effect

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps, { main: this })
        }

        delete(name: string): this {
            delete this[name as keyof Entity]

            if (!this.effect.hasContext(Systems)) {
                return this
            }

            const systemsMap = this.effect.context(Systems)['__systemsMap']

            if (!systemsMap[name]) {
                return this
            }

            for (let i = this.__systems.length - 1; i >= 0; --i) {
                const system = this.__systems[i]

                const componentsNames = (system.constructor as never as { components: string[] })
                    .components
                componentsNames.some(componentName => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((this as any)[componentName] != null) {
                        system.entities.remove(this as never)
                        this.__systems.splice(i, 1)

                        return true
                    }

                    return false
                })
            }

            return this
        }

        private onSystemsContext(): Destructor {
            Object.keys(this).forEach(k => {
                if (k !== '__systems' && k !== 'effect') {
                    this['__onAddComponent'](k)
                }
            })

            return () => {
                this['__systems'].forEach(system => {
                    system.entities.remove(this as never)
                    ;(system as never as { onRemoveEntity: Function })['onRemoveEntity'] &&
                        (system as never as { onRemoveEntity: Function })['onRemoveEntity'](this)
                })
                this['__systems'] = []
            }
        }

        private __onAddComponent(name: string): void {
            if (!this.effect.hasContext(Systems)) {
                return
            }

            const systemsMap = this.effect.context(Systems)['__systemsMap']

            if (!systemsMap[name]) {
                return
            }

            systemsMap[name].forEach(system => {
                const { components } = system.constructor as never as { components: string[] }
                if (components.every(componentName => this[componentName as keyof Entity])) {
                    if (!this['__systems'].find(system_ => system_ === system)) {
                        this['__systems'].push(system)
                        system.entities.push(this as never)
                        ;(system as never as { onAddEntity: Function })['onAddEntity'] &&
                            (system as never as { onAddEntity: Function })['onAddEntity'](this)
                    }
                }
            })
        }

        private __systems: System[] = []
    }
}

globalify(lib)
