/**
 * Generic type for class constructors
 *
 * Represents any class constructor that can be instantiated with `new`.
 * Useful for typing decorators, factory functions, and class utilities.
 *
 * @example
 * ```typescript
 * // Factory function accepting any class
 * function createInstance<T extends Class>(ctor: T): InstanceType<T> {
 *   return new ctor()
 * }
 *
 * class MyClass {
 *   value = 42
 * }
 *
 * const instance = createInstance(MyClass) // Type: MyClass
 *
 * // Decorator accepting class
 * function logged<T extends Class>(constructor: T) {
 *   console.log(`Class ${constructor.name} defined`)
 * }
 * ```
 *
 * @template T - Constructor signature type (defaults to any constructor)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<T extends new (...args: any[]) => any = new (...args: any[]) => any> = T
export default Class
