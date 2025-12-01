import globalify from '@sky-modules/core/globalify'

import local from './internal'

declare global {
    function defineSystem(systemName: string, Class: Class): void
}

namespace lib {
    /**
     * Registers a system class with the ECS architecture.
     *
     * Systems automatically receive entities that match their component requirements.
     * The system must declare a static `components` array listing required component names.
     *
     * @param systemName The name to use when accessing the system in a Systems context
     * @param Class The system class constructor
     *
     * @example Define a movement system
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
     * @example System with lifecycle hooks
     * ```typescript
     * class CollisionSystem extends System {
     *     static components = ['collider', 'position']
     *
     *     onAddEntity(entity: Entity): void {
     *         console.log('Entity added to collision system')
     *     }
     *
     *     onRemoveEntity(entity: Entity): void {
     *         console.log('Entity removed from collision system')
     *     }
     *
     *     update(ev: Sky.UpdateEvent): void {
     *         // Check collisions between entities
     *         for (let i = 0; i < this.entities.length; i++) {
     *             for (let j = i + 1; j < this.entities.length; j++) {
     *                 // Collision detection logic
     *             }
     *         }
     *     }
     * }
     *
     * defineSystem('collision', CollisionSystem)
     * ```
     */
    export function defineSystem(systemName: string, Class: new () => System): void {
        local.systems[systemName] = Class
    }
}

globalify(lib)
