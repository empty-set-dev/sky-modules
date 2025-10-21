import '../as'
import Class from '../Class'

import { DuplicateDefineError, InvalidDefineNameError, RuntimeDefineError } from './errors'
import Internal from './Internal'

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

export default define

define('sky.core.define', define)
type define = typeof define
function define<T extends object | Function>(name: string, value?: T): T
function define(name: string): (target: Class) => void
function define(name: string, value?: Function | Object): unknown {
    // Validate name format
    validateDefineName(name)

    // Check for duplicates
    if (Internal.defines[name] != null && (!isRuntime || !isHot())) {
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
            value: Internal.Static
        }

        if (typeof value === 'object') {
            as<Internal.Static>(value)
            define.value = value
            define.value[Internal.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
        } else if (typeof value === 'function') {
            as<Internal.Static>(value)
            define.value = value
            define.value[Internal.typeSymbol] = 'func'
        } else {
            throw new InvalidDefineNameError(name)
        }

        define.value[Internal.nameSymbol] = <string>name.split('.').pop()
        define.value[Internal.uidSymbol] = name

        Internal.defines[name] = define

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

        as<Internal.Static>(Target)

        Target.prototype.schema ??= {}
        Target[Internal.typeSymbol] = 'class'
        Target[Internal.nameSymbol] = Target.name
        Target[Internal.uidSymbol] = name

        Internal.defines[name] = {
            name,
            value: Target,
        }
        const propertiesMap = Internal.reactivePropertyDescriptors(Target.prototype.schema)
        Object.defineProperties(Target.prototype, propertiesMap)
    }
}

define('sky.core.schema', schema)
export type schema = typeof schema
export function schema<T extends object>(name: string, schema?: T): T {
    // Validate name format
    validateDefineName(name)

    as<{ [Internal.constructorSymbol]: Internal.Static }>(schema)

    if (Array.isArray(schema) || typeof schema !== 'object') {
        throw new InvalidDefineNameError(name)
    }

    const constructor: ReturnType<typeof Internal.makePlain> & Internal.Static =
        Internal.makePlain(schema)
    schema[Internal.constructorSymbol] = constructor

    const def = {
        name,
        value: constructor,
        [Internal.typeSymbol]: 'schema',
    }

    def.value[Internal.nameSymbol] = name.split('.').pop()
    def.value[Internal.uidSymbol] = name

    Internal.defines[name] = def

    return schema
}
