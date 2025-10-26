import assume from '../assume'

import define from './define'
import { InvalidDefineNameError } from './errors'
import Internal from './Internal/Internal'
import makePlain from './makePlain'

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
    if (!name || typeof name !== 'string') {
        throw new InvalidDefineNameError(name)
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) {
        throw new InvalidDefineNameError(name)
    }

    assume<{ [Internal.constructorSymbol]: Internal.Static }>(schema)

    if (Array.isArray(schema) || typeof schema !== 'object') {
        throw new InvalidDefineNameError(name)
    }

    const constructor: ReturnType<typeof makePlain> & Internal.Static = makePlain(schema)
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

export default schema
