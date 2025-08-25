import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    const define: typeof lib.define & { new (): void }
    const defineSchema: typeof lib.defineSchema & { new (): void }
}

namespace lib {
    define('sky.standard.define', define)
    export function define<T extends Function | object>(name: string, value?: T): T
    export function define(name: string): (target: Class) => void
    export function define(name: string, value?: Function | Object): unknown {
        if (local.defines[name] != null) {
            throw Error(`duplicate define ${name}`)
        }

        if (global.isRuntime) {
            throw Error('runtime define')
        }

        if (value != null) {
            const define = {
                name,
            } as {
                name: string
                value: local.Static
            }

            if (Array.isArray(value) || typeof value === 'object') {
                if (!canClone(value)) {
                    throw Error("can't clone object")
                }

                define.value = value as typeof value & local.Static
                define.value[local.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
            } else if (typeof value === 'function') {
                define.value = value as typeof value & local.Static
                define.value[local.typeSymbol] = 'func'
            } else {
                throw Error('unknown type')
            }

            define.value[local.nameSymbol] = name.split('.').pop()!
            define.value[local.uidSymbol] = name

            local.defines[name] = define

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

            if (!extends_type<local.Static>(Target)) {
                return null!
            }

            Target.prototype.schema ??= {}
            Target[local.typeSymbol] = 'class'
            Target[local.nameSymbol] = Target.name
            Target[local.uidSymbol] = name

            local.defines[name] = {
                name,
                value: Target,
            } as (typeof local.defines)['']
            const propertiesMap = local.reactivePropertyDescriptors(Target.prototype.schema)
            Object.defineProperties(Target.prototype, propertiesMap)
        }
    }

    export function defineSchema<T extends object>(name: string, schema?: T): T {
        if (!extends_type<{ [local.constructorSymbol]: local.Static }>(schema)) {
            return null!
        }

        if (Array.isArray(schema) || typeof schema !== 'object') {
            throw Error('schema can be only object')
        }

        const constructor = local.makePlain(schema) as ReturnType<typeof local.makePlain> &
            local.Static
        schema[local.constructorSymbol] = constructor

        const define = {
            name,
            value: constructor,
            [local.typeSymbol]: 'schema',
        }

        define.value[local.nameSymbol] = name.split('.').pop()
        define.value[local.uidSymbol] = name

        local.defines[name] = define

        return schema
    }
}

globalify(lib)
