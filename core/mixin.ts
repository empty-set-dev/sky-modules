export default function mixin<MT extends Class, T extends Class>(
    mixinConstructor: MT
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
