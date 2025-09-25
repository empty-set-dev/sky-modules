import local from './__local'

declare global {
    type define = typeof lib.define
    const define: typeof lib.define
    const schema: typeof lib.schema & { new (): void }
}

namespace lib {
    define('sky.core.define', define)
    export function define<T extends object | Function>(name: string, value?: T): T
    export function define(name: string): (target: Class) => void
    export function define(name: string, value?: Function | Object): unknown {
        if (local.defines[name] != null && (!isRuntime || !isHot())) {
            throw new Error(`duplicate define ${name}`)
        }

        if (isRuntime) {
            if (!isHot()) {
                throw new Error('runtime define')
            }
        }

        if (value != null) {
            const define = {
                name,
            } as {
                name: string
                value: local.Static
            }

            if (typeof value === 'object') {
                as<local.Static>(value)
                define.value = value
                define.value[local.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
            } else if (typeof value === 'function') {
                as<local.Static>(value)
                define.value = value
                define.value[local.typeSymbol] = 'func'
            } else {
                throw new Error('unknown type')
            }

            define.value[local.nameSymbol] = <string>name.split('.').pop()
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
                if (!isHot()) {
                    throw new Error('runtime define')
                }
            }

            as<local.Static>(Target)

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

    export function schema<T extends object>(name: string, schema?: T): T {
        as<{ [local.constructorSymbol]: local.Static }>(schema)

        if (Array.isArray(schema) || typeof schema !== 'object') {
            throw new Error('schema can be only object')
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
