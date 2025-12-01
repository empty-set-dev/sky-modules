/**
 * Method decorator that automatically binds method to instance
 *
 * Ensures that method always has correct `this` context, even when
 * passed as callback or detached from object. Useful for event handlers
 * and callbacks where `this` context is important.
 *
 * @example
 * ```typescript
 * class Component {
 *   name = 'MyComponent'
 *
 *   @bind
 *   handleClick() {
 *     console.log(this.name) // Always correct 'this'
 *   }
 *
 *   render() {
 *     // Safe to pass as callback - 'this' is bound
 *     button.addEventListener('click', this.handleClick)
 *   }
 * }
 * ```
 *
 * @template T - Function type
 * @param target - Class prototype
 * @param propertyKey - Method name
 * @param descriptor - Property descriptor
 * @returns Modified property descriptor with bound method
 */
export default function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    const key = Symbol()

    return {
        configurable: true,
        set(this: T, value_: Function): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(this as any)[key] = value_.bind(this)
        },
        get(this: T): T {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any)[key] == null) {
                if (!descriptor) {
                    return undefined as never as T
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this as any)[key] = descriptor.value!.bind(this)
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this as any)[key]
        },
    }
}
