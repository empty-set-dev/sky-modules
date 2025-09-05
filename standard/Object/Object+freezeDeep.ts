export {}

declare global {
    interface SymbolConstructor {
        readonly deeplyFrozen: unique symbol
    }

    interface ObjectConstructor {
        freezeDeep<T extends Record<string, unknown>>(object: T): Readonly<T>
        isFreezable(value: unknown): value is Record<string, unknown>
        isDeeplyFrozen(object: Object): boolean
    }

    interface Object {
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
