/**
 * Type definition for context constructors that can be used with the effect system.
 *
 * A context constructor must have a static `context` property set to `true` to be
 * recognized by the effect system for dependency injection and lifecycle management.
 *
 * @example
 * ```typescript
 * class MyContext {
 *   static context = true
 *
 *   constructor(public value: string) {}
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContextConstructor = { new (...args: any[]): any; context: true }
export default ContextConstructor
