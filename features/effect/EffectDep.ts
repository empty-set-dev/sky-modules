import ContextConstructor from './ContextConstructor'
import internal from './internal'

/**
 * Defines the dependency types that can be used when creating effects.
 *
 * An EffectDep can be either:
 * - A single EffectBase instance (simple dependency)
 * - A tuple of [EffectBase, ContextConstructor] (context-aware dependency)
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
type EffectDep = internal.EffectBase | [internal.EffectBase, ContextConstructor]
export default EffectDep
