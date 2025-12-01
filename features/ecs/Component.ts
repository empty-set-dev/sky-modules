import globalify from '@sky-modules/core/globalify'

declare global {
    class Component extends lib.Component {}
}

namespace lib {
    /**
     * Base class for all ECS components.
     *
     * Components are data containers attached to entities. They hold state but no behavior.
     * Systems operate on entities that have specific component combinations.
     *
     * @example Basic component
     * ```typescript
     * class PositionComponent extends Component {
     *     x: number = 0
     *     y: number = 0
     * }
     *
     * defineComponent('position', PositionComponent)
     * ```
     *
     * @example Component with initialization
     * ```typescript
     * class HealthComponent extends Component {
     *     current: number
     *     max: number
     *
     *     constructor(entity: Entity) {
     *         super(entity)
     *         this.max = 100
     *         this.current = this.max
     *     }
     * }
     *
     * defineComponent('health', HealthComponent)
     * ```
     */
    export class Component {
        /** Reference to the entity this component is attached to */
        entity: Entity

        /**
         * Creates a new component instance.
         * @param entity The entity this component belongs to
         */
        constructor(entity: Entity) {
            this.entity = entity
        }
    }
}

globalify(lib)
