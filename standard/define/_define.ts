import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    const define: typeof lib.define & { new (): void }
}

namespace lib {
    define('sky.standard.define', define)
    export function define<T extends Function | object>(name: string, value?: T): T
    export function define(name: string): (target: Class) => void
    export function define(name: string, value?: Function | Object): unknown {
        if (global.isRuntime) {
            throw Error('runtime define')
        }

        if (value != null) {
            const define = {
                name,
                value,
            }

            local.defines[name] = define as typeof define & (typeof local.defines)['']

            if (name.endsWith('Schema')) {
                local.defines[name].value[local.typeSymbol] = 'schema'
            } else if (Array.isArray(value)) {
                local.defines[name].value[local.typeSymbol] = 'array'
            } else if (typeof value === 'object') {
                local.defines[name].value[local.typeSymbol] = 'object'
            } else if (typeof value === 'function') {
                local.defines[name].value[local.typeSymbol] = 'func'
            }

            return value
        }

        return function <
            T extends {
                new (...args: unknown[]): {}
                prototype: {}
            },
        >(Target: T): unknown {
            if (global.isRuntime) {
                throw Error('runtime define')
            }

            if (
                !extends_type<local.Static>(Target) ||
                !extends_type<local.Prototype>(Target.prototype)
            ) {
                return null!
            }

            const define = {
                name,
                value: Target,
            }

            local.defines[name] = define as typeof define & (typeof local.defines)['']
            local.defines[name].value[local.typeSymbol] = 'class'
            const propertiesMap = local.reactivePropertyDescriptors(Target.prototype.schema)
            Object.defineProperties(Target.prototype, propertiesMap)
        }
    }
}

globalify(lib)
