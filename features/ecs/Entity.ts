import './Systems'

import globalify from '@sky-modules/core/globalify'

declare global {
    class Entity extends lib.Entity {}
}

namespace lib {
    /**
     * Base class for all entities in the ECS architecture.
     *
     * Entities are containers for components and are automatically registered with systems
     * based on their component composition. Components are accessed as lazy-initialized properties.
     *
     * @example Creating an entity with components
     * ```typescript
     * // Define components
     * class PositionComponent extends Component {
     *     x: number = 0
     *     y: number = 0
     * }
     *
     * class VelocityComponent extends Component {
     *     x: number = 0
     *     y: number = 0
     * }
     *
     * defineComponent('position', PositionComponent)
     * defineComponent('velocity', VelocityComponent)
     *
     * // Create entity
     * const entity = new Entity(effectTree)
     * entity.position.x = 10
     * entity.velocity.x = 5
     * ```
     *
     * @example Removing components dynamically
     * ```typescript
     * const entity = new Entity(effectTree)
     * entity.position.x = 10
     * entity.velocity.x = 5
     *
     * // Remove component
     * entity.delete('velocity') // Entity will be removed from systems requiring velocity
     * ```
     *
     * @example Checking for components
     * ```typescript
     * const entity = new Entity(effectTree)
     * entity.position.x = 10
     *
     * if (entity.has('position')) {
     *     console.log('Entity has position component')
     * }
     * ```
     */
    export class Entity {
        /** Effect instance managing this entity's lifecycle and dependencies */
        readonly effect: Effect

        /**
         * Creates a new entity.
         * @param dep The effect dependency (usually an EffectTree or parent Effect)
         */
        constructor(dep: EffectDep) {
            this.effect = new Effect(dep, this)
        }

        /**
         * Called when the entity is added to a Systems context.
         * Registers all existing components with appropriate systems.
         * @returns Cleanup function to unregister from all systems
         */
        protected onSystemsContext(): Destructor {
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

        /**
         * Checks if the entity has a specific component.
         * @param name The component name to check
         * @returns True if the component exists on this entity
         */
        has(name: string): boolean {
            return !!Object.getOwnPropertyDescriptor(this, name)
        }

        /**
         * Removes a component from the entity.
         * The entity will be automatically removed from systems that require this component.
         * @param name The component name to remove
         * @returns This entity instance for method chaining
         */
        delete(name: string): this {
            const component = this[name as keyof Entity] as { effect?: Effect }

            component.effect?.destroy && component.effect.destroy()

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
                if (componentsNames.includes(name)) {
                    system.entities.remove(this as never)
                    this.__systems.splice(i, 1)
                }
            }

            return this
        }

        /**
         * Hook that forwards events to all components on this entity.
         * If a component has a method matching the event name, it will be called.
         * @param eventName The name of the event
         * @param event The event data
         * @param next The next handler in the chain
         */
        @hook
        protected onAny(eventName: string, event: Sky.Event, next: Function): void {
            Object.keys(this).forEach(k => {
                if (k === '__systems' || k === 'effect') {
                    return
                }

                if (this[k as never] && this[k as never][eventName]) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(this[k as never][eventName] as any)(event)
                }
            })

            next()
        }

        /**
         * Internal method to register a component with appropriate systems.
         * Called automatically when a component is accessed for the first time.
         * @param name The component name
         */
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

        /** Internal array tracking which systems this entity belongs to */
        private __systems: System[] = []
    }
}

globalify(lib)
