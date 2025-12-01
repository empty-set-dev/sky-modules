/**
 * Type assertion function that assumes value is of specified type
 *
 * A no-op function that tells TypeScript to trust that a value has
 * a specific type. Use when you know the type but TypeScript doesn't,
 * or when type inference fails. No runtime validation is performed.
 *
 * @example
 * ```typescript
 * // Assume unknown is specific type
 * function process(data: unknown) {
 *   assume<{ name: string }>(data)
 *   console.log(data.name) // TypeScript knows data has name property
 * }
 *
 * // Widen interface
 * const obj: EventEmitter = new EventEmitter()
 * assume<EventEmitter & { customProp: string }>(obj)
 * obj.customProp = 'value' // TypeScript accepts this
 * ```
 *
 * @template T - Type to assert
 * @param value - Value to assume has type T
 */
type assume = typeof assume
function assume<T>(value: unknown): asserts value is T {
    //
}

export default assume
