export {}

declare global {
    interface SymbolConstructor {
        /**
         * Symbol marking deeply frozen objects
         */
        readonly deeplyFrozen: unique symbol
    }

    interface ObjectConstructor {
        /**
         * Deep freeze an object and all nested objects/arrays
         *
         * Recursively freezes an object and all its nested properties,
         * making the entire object tree immutable. Marks frozen objects
         * with Symbol.deeplyFrozen for tracking.
         *
         * @example
         * ```typescript
         * const config = {
         *   api: { url: 'https://api.example.com' },
         *   features: ['auth', 'analytics']
         * }
         *
         * Object.freezeDeep(config)
         *
         * // All mutation attempts fail
         * config.api.url = 'other' // Error in strict mode
         * config.features.push('new') // Error
         * ```
         *
         * @template T - Object type to freeze
         * @param object - Object to freeze deeply
         * @returns Readonly version of the object
         */
        freezeDeep<T extends Record<string, unknown>>(object: T): Readonly<T>
        /**
         * Check if a value can be frozen (is object or function)
         *
         * @example
         * ```typescript
         * Object.isFreezable({}) // true
         * Object.isFreezable([]) // true
         * Object.isFreezable(() => {}) // true
         * Object.isFreezable(null) // false
         * Object.isFreezable(42) // false
         * ```
         *
         * @param value - Value to check
         * @returns true if value can be frozen
         */
        isFreezable(value: unknown): value is Record<string, unknown>
        /**
         * Check if an object has been deeply frozen
         *
         * @example
         * ```typescript
         * const obj = { a: { b: 1 } }
         * Object.isDeeplyFrozen(obj) // false
         *
         * Object.freezeDeep(obj)
         * Object.isDeeplyFrozen(obj) // true
         * ```
         *
         * @param object - Object to check
         * @returns true if object was deeply frozen
         */
        isDeeplyFrozen(object: Object): boolean
    }

    interface Object {
        /** Marker for deeply frozen objects */
        [Symbol.deeplyFrozen]?: true
    }
}

;(<{ deeplyFrozen: symbol }>Symbol).deeplyFrozen = Symbol('deeplyFrozen')

Object.freezeDeep = function freezeDeep<T extends Record<PropertyKey, unknown>>(
    object: T
): Readonly<T> {
    Array.isArray(object)
        ? object.forEach(value => Object.isFreezable(value) && Object.freezeDeep(value))
        : Object.values(object).forEach(
              value => Object.isFreezable(value) && Object.freezeDeep(value)
          )

    Object.defineProperty(object, Symbol.deeplyFrozen, {
        value: true,
    })
    return Object.freeze(object)
}

Object.isFreezable = function isFreezable(value: unknown): value is Record<string, unknown> {
    return value == null ? false : typeof value === 'object' || typeof value === 'function'
}

Object.isDeeplyFrozen = function isDeeplyFrozen(object: Object): boolean {
    return !!object[Symbol.deeplyFrozen]
}
