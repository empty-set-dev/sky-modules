import assume from '#/assume/assume'
import Class from '#/Class/Class'
import isHot from '#/hmr/isHot'
import isRuntime from '#/runtime/isRuntime'

import { DuplicateDefineError, InvalidDefineNameError, RuntimeDefineError } from './errors'
import Internal from './internal/internal'

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
 * Registers a value or class in the module system.
 * Can be used as a function or decorator.
 *
 * The define system provides:
 * - Module registration and discovery
 * - Hot module replacement (HMR) support
 * - Type-safe module access
 * - Validation and duplicate detection
 *
 * @example
 * ```typescript
 * // Define a class with decorator
 * @define('app.MyService')
 * class MyService {
 *   doSomething() {}
 * }
 *
 * // Define a function
 * define('app.utils.helper', function helper() {
 *   return 'help'
 * })
 *
 * // Define an object
 * define('app.config', {
 *   apiUrl: 'https://api.example.com'
 * })
 * ```
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

    // Check for duplicates (allow re-registration during HMR)
    if (Internal.defines[name] != null && (!isRuntime || !isHot())) {
        throw new DuplicateDefineError(name)
    }

    // Check runtime constraints
    if (isRuntime() && !isHot()) {
        throw new RuntimeDefineError()
    }

    if (value != null) {
        const define = {
            name,
        } as {
            name: string
            value: Internal.Static
        }

        if (typeof value === 'object') {
            assume<Internal.Static>(value)
            define.value = value
            define.value[Internal.typeSymbol] = Array.isArray(value) ? 'array' : 'object'
        } else if (typeof value === 'function') {
            assume<Internal.Static>(value)
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
            prototype: { schema?: object }
        },
    >(Target: T): void {
        if (isRuntime() && !isHot()) {
            throw new RuntimeDefineError()
        }

        assume<Internal.Static>(Target)

        Target[Internal.typeSymbol] = 'class'
        Target[Internal.nameSymbol] = Target.name
        Target[Internal.uidSymbol] = name

        Internal.defines[name] = {
            name,
            value: Target,
        }
    }
}
