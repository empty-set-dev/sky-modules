import globalify from '@sky-modules/core/globalify'

declare global {
    abstract class System extends lib.System {}
    function defineSystem(systemName: string, Class: Class): void
}

namespace lib {
    // TODO system hooks, affects
    /**
     * Base class for all ECS systems.
     *
     * Systems contain the logic that operates on entities with specific component combinations.
     * Each system declares which components it requires, and automatically receives entities
     * that match those requirements.
     *
     * @example Basic movement system
     * ```typescript
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
     * ```
     *
     * @example System with entity lifecycle hooks
     * ```typescript
     * class RenderSystem extends System {
     *     static components = ['sprite', 'position']
     *
     *     onAddEntity(entity: Entity): void {
     *         console.log('Entity added to render system')
     *     }
     *
     *     onRemoveEntity(entity: Entity): void {
     *         console.log('Entity removed from render system')
     *     }
     *
     *     update(ev: Sky.UpdateEvent): void {
     *         this.entities.forEach(entity => {
     *             // Render sprite at position
     *         })
     *     }
     * }
     *
     * defineSystem('render', RenderSystem)
     * ```
     */
    export abstract class System {
        /** Array of entities that match this system's component requirements */
        entities: Entity[] = []

        /**
         * Main system logic execution method. Override to implement system behavior.
         * Called automatically during the game loop.
         *
         * @param dt Delta time in seconds since last frame
         */
        run(dt: number): void {
            dt
            return null!
        }
    }
}

globalify(lib)
