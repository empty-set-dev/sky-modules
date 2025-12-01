import './Entity'

import globalify from '@sky-modules/core/globalify'

declare global {
    function defineComponent(componentName: string, Class: Class): void
}

namespace lib {
    export function component(componentName: string) {
        return function (target: Object) {}
    }
    /**
     * Registers a component class with the ECS system.
     *
     * Components are lazy-initialized as properties on entities. When accessed for the first time,
     * the component is instantiated and the entity is automatically registered with matching systems.
     *
     * @param componentName The name to use when accessing the component on entities
     * @param Class The component class constructor
     *
     * @example Define a position component
     * ```typescript
     * class PositionComponent extends Component {
     *     x: number = 0
     *     y: number = 0
     *     z: number = 0
     * }
     *
     * defineComponent('position', PositionComponent)
     *
     * // Usage
     * const entity = new Entity(effectTree)
     * entity.position.x = 10 // Component is created on first access
     * ```
     *
     * @example Define a component with initialization
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
    export function defineComponent(componentName: string, Class: Class<typeof Component>): void {
        Object.defineProperty(Entity.prototype, componentName, {
            get(this: Entity) {
                if (Object.getOwnPropertyDescriptor(this, componentName) == null) {
                    const component = new Class(this)
                    Object.defineProperty(this, componentName, {
                        value: component,
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    })
                    this['__onAddComponent'](componentName)
                }

                return this[componentName as keyof typeof this]
            },
        })
    }
}

globalify(lib)
