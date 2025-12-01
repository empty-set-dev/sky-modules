function copyPrototype(source: object, target: object): void {
    const nextPrototype = Object.getPrototypeOf(source)

    if (nextPrototype != null) {
        copyPrototype(nextPrototype, target)
    }

    const propertyDescriptors = Object.getOwnPropertyDescriptors(source)

    Object.keys(propertyDescriptors).forEach(k => {
        if (k === '__hooks') {
            return
        }

        if (propertyDescriptors[k].value == null) {
            return
        }

        Object.defineProperty(target, k, propertyDescriptors[k])
    })
}

/**
 * Class decorator to mix in functionality from another class
 *
 * Copies all methods and properties from mixin class to target class,
 * including hooks integration. Enables composition-based inheritance
 * patterns in TypeScript.
 *
 * @example
 * ```typescript
 * class Timestamped {
 *   createdAt = Date.now()
 *
 *   getAge() {
 *     return Date.now() - this.createdAt
 *   }
 * }
 *
 * class Loggable {
 *   log(message: string) {
 *     console.log(`[${this.constructor.name}] ${message}`)
 *   }
 * }
 *
 * @mixin(Timestamped)
 * @mixin(Loggable)
 * class User {
 *   name: string
 * }
 *
 * const user = new User()
 * user.log('Created') // From Loggable
 * user.getAge() // From Timestamped
 * ```
 *
 * @template M - Mixin class type
 * @template T - Target class type
 * @param mixinConstructor - Class to mix into target
 * @returns Decorator function for target class
 */
export default function mixin<M extends Class, T extends Class>(
    mixinConstructor: M
): (constructor: T) => void {
    return function decorator(constructor: T): void {
        mixinConstructor.prototype.__hooks &&
            Object.keys(mixinConstructor.prototype.__hooks).forEach(k => {
                hook(constructor.prototype, k, {
                    value: mixinConstructor.prototype.__hooks[k],
                })
            })

        copyPrototype(mixinConstructor.prototype, constructor.prototype)
    }
}
