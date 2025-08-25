export {}

declare global {
    interface ObjectConstructor {
        freezeDeep<T extends Object>(object: T): Readonly<T>
    }
}

define('sky.standard.Object.freezeDeep', freezeDeep)
function freezeDeep<T extends Object>(object: T): Readonly<T> {
    if (Array.isArray(object)) {
        object.forEach(value => Object.freezeDeep(value))
    } else {
        Object.keys(object).forEach(k =>
            Array.isArray(object[k as keyof T]) ||
            typeof object[k as keyof T] === 'object' ||
            typeof object[k as keyof T] === 'function'
                ? Object.freezeDeep(object[k as keyof T] as Object)
                : null
        )
    }

    return Object.freeze(object)
}
Object.freezeDeep = freezeDeep
Object.defineProperty(Object.prototype, 'freezeDeep', {
    enumerable: false,
})
