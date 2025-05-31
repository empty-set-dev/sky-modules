import './_Entity'
import globalify from 'sky/utilities/globalify'

declare global {
    function defineComponent(componentName: string, Class: Class): void
}

namespace module {
    export function defineComponent(componentName: string, Class: Class): void {
        console.log(componentName)
        Object.defineProperty(Entity.prototype, componentName, {
            get() {
                console.log('???')
                if (Object.getOwnPropertyDescriptor(this, componentName) == null) {
                    Object.defineProperty(this, componentName, {
                        value: new Class(),
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

globalify(module)
