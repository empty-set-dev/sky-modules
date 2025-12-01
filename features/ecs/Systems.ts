import globalify from '@sky-modules/core/globalify'

import local from './internal'

declare global {
    class Systems extends lib.Systems {}
}

namespace lib {
    /**
     * ECS systems orchestrator that manages all registered systems.
     *
     * Systems is a context that can be added to the effect tree. It instantiates all
     * registered systems and coordinates entity registration across systems.
     * Entities within this context are automatically added to systems that match their components.
     *
     * @example Setting up ECS with systems
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
     * // Define system
     * class MovementSystem extends System {
     *     static components = ['position', 'velocity']
     *
     *     update(ev: Sky.UpdateEvent): void {
     *         this.entities.forEach(entity => {
     *             entity.position.x += entity.velocity.x * ev.dt
     *             entity.position.y += entity.velocity.y * ev.dt
     *         })
     *     }
     * }
     *
     * defineSystem('movement', MovementSystem)
     *
     * // Create effect tree and systems
     * const effectTree = new EffectTree()
     * const systems = new Systems(effectTree)
     * effectTree.addContext(systems)
     * effectTree.commit()
     *
     * // Create entity - it will be automatically added to MovementSystem
     * const entity = new Entity(effectTree)
     * entity.position.x = 0
     * entity.velocity.x = 10
     * ```
     */
    export class Systems {
        /** Marks this class as a context for the effect system */
        static context = true

        /** Effect instance managing this systems context lifecycle */
        readonly effect: Effect

        /**
         * Creates a new Systems orchestrator.
         * @param dep The effect dependency (usually an EffectTree)
         */
        constructor(dep: EffectDep) {
            this.effect = new Effect(dep, this)

            this.__systemsMap = {}

            Object.keys(local.systems).forEach(systemName => {
                const system = new local.systems[systemName]()
                ;(this as never as Record<string, System>)[systemName] = system
                const { components } = system.constructor as never as { components: string[] }
                components.forEach(componentName => {
                    this.__systemsMap[componentName] ??= []
                    if (!this.__systemsMap[componentName].includes(system)) {
                        this.__systemsMap[componentName].push(system)
                    }
                })
            })
        }

        /**
         * Called on every update cycle. Forwards update events to all systems.
         * @param ev The update event containing delta time
         */
        protected update(ev: Sky.UpdateEvent): void {
            this.__timer ??= new Timer('[Systems].run')
            Object.keys(local.systems).forEach(systemName => {
                const system = (this as never as Record<string, System>)[systemName] as System
                const systemWithUpdate = system as { update?: (ev: Sky.UpdateEvent) => void }
                systemWithUpdate.update && systemWithUpdate.update(ev)
            })
        }

        /** Internal map tracking which systems require each component */
        private __systemsMap: Record<string, System[]>
        /** Internal timer for performance tracking */
        private __timer!: Timer
    }
}

globalify(lib)
