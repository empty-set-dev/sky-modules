// Define registration testing utilities

import { expect } from 'vitest'

/**
 * Test helper to verify define registration
 *
 * Checks that a module is correctly registered in the define system with:
 * - Correct UID in Internal.defines
 * - Proper type metadata
 * - Correct name symbol
 * - Expected value reference
 *
 * @example
 * ```typescript
 * import Internal from '@sky-modules/core/define/internal/internal'
 * import { expectDefineRegistration } from '../../../cli/test-utils'
 * import myFunction from '../myFunction'
 *
 * test('should register myFunction with define', () => {
 *   expectDefineRegistration({
 *     uid: 'sky.core.myFunction',
 *     value: myFunction,
 *     type: 'func',
 *     name: 'myFunction',
 *     Internal
 *   })
 * })
 * ```
 */
export function expectDefineRegistration(options: {
    /** Unique identifier in defines registry (e.g., 'sky.core.fire') */
    uid: string
    /** Expected registered value (function, object, class, etc.) */
    value: any
    /** Expected type: 'func', 'object', 'array', 'class' */
    type: 'func' | 'object' | 'array' | 'class'
    /** Expected short name (e.g., 'fire' from 'sky.core.fire') */
    name: string
    /** Internal define system object (from @sky-modules/core/define/internal/internal) */
    Internal: any
}) {
    const { uid, value, type, name, Internal } = options

    // Check registration in defines registry
    const definition = Internal.defines[uid]
    expect(definition, `Define registration '${uid}' not found in Internal.defines`).toBeDefined()
    expect(definition.name, `Define registration '${uid}' has incorrect name`).toBe(uid)
    expect(definition.value, `Define registration '${uid}' has incorrect value reference`).toBe(value)

    // Check metadata symbols
    expect(value[Internal.typeSymbol], `Value ${name} missing type symbol`).toBe(type)
    expect(value[Internal.nameSymbol], `Value ${name} has incorrect name symbol`).toBe(name)
    expect(value[Internal.uidSymbol], `Value ${name} has incorrect uid symbol`).toBe(uid)
}

/**
 * Test helper to verify multiple define registrations at once
 *
 * @example
 * ```typescript
 * import Internal from '@sky-modules/core/define/internal/internal'
 * import { expectDefineRegistrations } from '../../../cli/test-utils'
 * import { fire, task } from '../async'
 *
 * test('should register all async utilities', () => {
 *   expectDefineRegistrations(Internal, [
 *     { uid: 'sky.core.fire', value: fire, type: 'func', name: 'fire' },
 *     { uid: 'sky.core.task', value: task, type: 'func', name: 'task' }
 *   ])
 * })
 * ```
 */
export function expectDefineRegistrations(
    Internal: any,
    registrations: Array<{
        uid: string
        value: any
        type: 'func' | 'object' | 'array' | 'class'
        name: string
    }>
) {
    for (const registration of registrations) {
        expectDefineRegistration({ ...registration, Internal })
    }
}

/**
 * Test helper to verify global availability of defined modules
 *
 * Checks that defined values are accessible via global object
 * (requires globalify to be used)
 *
 * @example
 * ```typescript
 * import { expectGlobalDefine } from '../../../cli/test-utils'
 * import fire from '../fire'
 *
 * test('should be globally available', () => {
 *   expectGlobalDefine('fire', fire)
 * })
 * ```
 */
export function expectGlobalDefine(globalName: string, value: any) {
    expect(global[globalName], `Global '${globalName}' not found`).toBeDefined()
    expect(global[globalName], `Global '${globalName}' has incorrect value`).toBe(value)
}
