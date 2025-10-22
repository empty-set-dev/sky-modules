import as from '../as'
import Class from '../Class'
import { isHot } from '../hmr'

import { DuplicateDefineError, InvalidDefineNameError, RuntimeDefineError } from './errors'
import Internal from './Internal'
import reactivePropertyDescriptors from './reactivePropertyDescriptors'

/**
 * Validates define name format.
 * Name must start with a letter and contain only alphanumeric characters, dots, and underscores.
 * @param name - The name to validate
 * @throws {InvalidDefineNameError} If name format is invalid
 */
function validateDefineName(name: string): void {
    if (!name || typeof name !== 'string') {
        throw new InvalidDefineNameError(name)
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) {
        throw new InvalidDefineNameError(name)
    }
}

export default define

define('sky.core.define', define)
type define = typeof define

/**
 * Registers a value or class in the Sky Modules system.
 * Can be used as a function or decorator.
 *
 * @param name - Unique identifier for the defined value (e.g., 'sky.core.MyClass')
 * @param value - Optional value to register (object or function)
 * @returns The registered value or a decorator function
 * @throws {DuplicateDefineError} If name is already registered
 * @throws {RuntimeDefineError} If called at runtime without HMR
 * @throws {InvalidDefineNameError} If name format is invalid
 */
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
            prototype: { schema: object }
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
        const propertiesMap = reactivePropertyDescriptors(Target.prototype.schema)
        Object.defineProperties(Target.prototype, propertiesMap)
    }
}

define('sky.core.schema', schema)
export type schema = typeof schema

/**
 * Creates a reactive schema for data structures.
 * Automatically generates constructors and reactive property descriptors.
 *
 * @param name - Unique identifier for the schema (e.g., 'app.models.UserData')
 * @param schema - Object defining the schema structure
 * @returns The schema with attached constructor
 * @throws {InvalidDefineNameError} If name format is invalid or schema is not an object
 *
 * @example
 * ```ts
 * const UserSchema = schema('app.UserSchema', {
 *   name: string,
 *   age: number
 * })
 * ```
 */
export function schema<T extends object>(name: string, schema?: T): T {
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
