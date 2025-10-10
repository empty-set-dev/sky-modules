import ContextConstructor from './ContextConstructor'
import internal from './internal'

/**
 * Defines the dependency types that can be used when creating effects.
 *
 * An EffectDep can be either:
 * - A single BaseOfEffect instance (simple dependency)
 * - A tuple of [BaseOfEffect, ContextConstructor] (context-aware dependency)
 *
 * @example
 * ```typescript
 ** Simple dependency
 * const effect1 = new Effect(parentEffect)
 *
 ** Context-aware dependency
 * const effect2 = new Effect([parentEffect, MyContext])
 * ```
 */
type EffectDep = internal.BaseOfEffect | [internal.BaseOfEffect, ContextConstructor]
export default EffectDep
