import local from './__local'

declare global {
    type define = typeof lib.define
    const define: typeof lib.define
    const defineSchema: typeof lib.defineSchema & { new (): void }
}

namespace lib {
    define('sky.standard.define', define)
    export function define<T extends object | Function>(name: string, value?: T): T
    export function define(name: string): (target: Class) => void
    export function define(name: string, value?: Function | Object): unknown {
        if (local.defines[name] != null) {
            throw Error(`duplicate define ${name}`)
        }

        if (isRuntime) {
            if (local.isHot) {
                throw Error('not implemented')
            }

            throw Error('runtime define')
        }

        if (value != null) {
            const define = {
                name,
            } as {
                name: string
                value: local.Static
            }

            if (typeof value === 'object') {
                extends_type<local.Static>(value)
                define.value = value
                define.value[local.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
            } else if (typeof value === 'function') {
                extends_type<local.Static>(value)
                define.value = value
                define.value[local.typeSymbol] = 'func'
            } else {
                throw Error('unknown type')
            }

            define.value[local.nameSymbol] = name.split('.').pop()!
            define.value[local.uidSymbol] = name

            local.defines[name] = define

            return value
        }

        return function define<
            T extends {
                new (...args: unknown[]): {}
                prototype: {}
            },
        >(Target: T): void {
            if (isRuntime) {
                throw Error('runtime define')
            }

            extends_type<local.Static>(Target)

            Target.prototype.schema ??= {}
            Target[local.typeSymbol] = 'class'
            Target[local.nameSymbol] = Target.name
            Target[local.uidSymbol] = name

            local.defines[name] = {
                name,
                value: Target,
            }
            const propertiesMap = local.reactivePropertyDescriptors(Target.prototype.schema)
            Object.defineProperties(Target.prototype, propertiesMap)
        }
    }

    // TODO defineSchema > type
    export function defineSchema<T extends object>(name: string, schema?: T): T {
        extends_type<{ [local.constructorSymbol]: local.Static }>(schema)

        if (Array.isArray(schema) || typeof schema !== 'object') {
            throw Error('schema can be only object')
        }

        const constructor: ReturnType<typeof local.makePlain> & local.Static =
            local.makePlain(schema)
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

Object.assign(global, lib)
