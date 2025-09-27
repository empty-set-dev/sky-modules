import './_Entity'

import globalify from 'sky/core/globalify'

declare global {
    function defineComponent(componentName: string, Class: Class): void
}

namespace lib {
    export function component(componentName: string) {
        return function (target: Object) {}
    }
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
