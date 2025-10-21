import '@sky-modules/core/as'
import '@sky-modules/core/hmr'
import { DuplicateDefineError, InvalidDefineNameError, RuntimeDefineError } from './errors'
import internal from './Internal'

declare global {
    function define<T extends object | Function>(name: string, value?: T): T
    function define(name: string): (target: Class) => void
    function schema<T extends object>(name: string, schema?: T): T
}

// Validate define name format
function validateDefineName(name: string): void {
    if (!name || typeof name !== 'string') {
        throw new InvalidDefineNameError(name)
    }

    // Name must start with letter, contain only alphanumeric, dots, underscores
    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) {
        throw new InvalidDefineNameError(name)
    }
}

export default function define<T extends object | Function>(name: string, value?: T): T
export function define(name: string): (target: Class) => void
export function define(name: string, value?: Function | Object): unknown {
    // Validate name format
    validateDefineName(name)

    // Check for duplicates
    if (internal.defines[name] != null && (!isRuntime || !isHot())) {
        throw new DuplicateDefineError(name)
    }

    // Check runtime constraints
    if (isRuntime) {
        if (!isHot()) {
            throw new RuntimeDefineError()
        }
    }

    if (value != null) {
        const define = {
            name,
        } as {
            name: string
            value: internal.Static
        }

        if (typeof value === 'object') {
            as<internal.Static>(value)
            define.value = value
            define.value[internal.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
        } else if (typeof value === 'function') {
            as<internal.Static>(value)
            define.value = value
            define.value[internal.typeSymbol] = 'func'
        } else {
            throw new InvalidDefineNameError(name)
        }

        define.value[internal.nameSymbol] = <string>name.split('.').pop()
        define.value[internal.uidSymbol] = name

        internal.defines[name] = define

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
                throw new RuntimeDefineError()
            }
        }

        as<internal.Static>(Target)

        Target.prototype.schema ??= {}
        Target[internal.typeSymbol] = 'class'
        Target[internal.nameSymbol] = Target.name
        Target[internal.uidSymbol] = name

        internal.defines[name] = {
            name,
            value: Target,
        }
        const propertiesMap = internal.reactivePropertyDescriptors(Target.prototype.schema)
        Object.defineProperties(Target.prototype, propertiesMap)
    }
}

export function schema<T extends object>(name: string, schema?: T): T {
    // Validate name format
    validateDefineName(name)

    as<{ [internal.constructorSymbol]: internal.Static }>(schema)

    if (Array.isArray(schema) || typeof schema !== 'object') {
        throw new InvalidDefineNameError(name)
    }

    const constructor: ReturnType<typeof internal.makePlain> & internal.Static =
        internal.makePlain(schema)
    schema[internal.constructorSymbol] = constructor

    const def = {
        name,
        value: constructor,
        [internal.typeSymbol]: 'schema',
    }

    def.value[internal.nameSymbol] = name.split('.').pop()
    def.value[internal.uidSymbol] = name

    internal.defines[name] = def

    return schema
}

// Export to global namespace immediately
Object.assign(global, { define, schema })
