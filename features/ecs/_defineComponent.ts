import './_Entity'
import globalify from 'sky/utilities/globalify'

declare global {
    function defineComponent(componentName: string, Class: Class): void
}

namespace lib {
    export function defineComponent(componentName: string, Class: Class<typeof Component>): void {
        Object.defineProperty(Entity.prototype, componentName, {
            get() {
                if (Object.getOwnPropertyDescriptor(this, componentName) == null) {
                    const component = new Class(this)
                    Object.defineProperty(this, componentName, {
                        value: component,
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    })
                    this.__onAddComponent(componentName)
                }

                return this[componentName]
            },
            set(value: undefined | { x: number; y: number }) {
                Object.defineProperty(this, componentName, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                })
            },
        })
    }
}

globalify(lib)
