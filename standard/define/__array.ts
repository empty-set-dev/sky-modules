const arrayPrototype = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(Array.prototype) as TypedPropertyDescriptor<unknown>[] & {
        [x: string]: PropertyDescriptor
    } & PropertyDescriptorMap
) as typeof Array.prototype

arrayPrototype.copyWithin = function <T>(
    this: Array<T>,
    target: number,
    start: number,
    end: number
): Array<T> {
    Array.prototype.copyWithin.call(this, target, start, end)

    return this
}

arrayPrototype.fill = function <T>(
    this: Array<T>,
    value: unknown,
    start?: number,
    end?: number
): Array<T> {
    Array.prototype.fill.call(this, value, start, end)

    return this
}

export default function array<T>(array: T[]): T[] {
    Object.setPrototypeOf(array, arrayPrototype)
    return array
}

// const arr = array([1, 2, 3])
// arr.fill(42, 0, 100)
// console.log(arr)
