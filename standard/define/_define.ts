import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    const define: typeof lib.define & { new (): void }
}

namespace lib {
    define('sky.standard.define', define)
    export function define<T extends Function | Object>(name: string, value?: T): T
    export function define(name: string): (target: Class) => void
    export function define(name: string, value?: Function | Object): unknown {
        if (isRuntime) {
            throw Error('runtime define')
        }

        if (value != null) {
            const define = {
                name,
                value,
            }

            local.defines[name] = define as typeof define & (typeof local.defines)['']

            if (Array.isArray(value)) {
                local.defines[name].value[local.typeSymbol] = 'array'
            } else if (typeof value === 'object') {
                local.defines[name].value[local.typeSymbol] = 'object'
            } else if (typeof value === 'function') {
                local.defines[name].value[local.typeSymbol] = 'func'
            }

            return value
        }

        return function (target: Class): void {
            if (isRuntime) {
                throw Error('runtime define')
            }

            if (!extends_type<{ [k: symbol]: number | string }>(target)) {
                return null!
            }

            // console.log(name)

            // console.log(Object.getOwnPropertyDescriptors(target.prototype))

            const define = {
                name,
                value: target,
            }

            local.defines[name] = define as typeof define & (typeof local.defines)['']
            local.defines[name].value[local.typeSymbol] = 'class'
        }
    }
}

globalify(lib)
