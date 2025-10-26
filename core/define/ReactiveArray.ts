const reactiveArrayPrototype = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(Array.prototype) as TypedPropertyDescriptor<unknown>[] & {
        [x: string]: PropertyDescriptor
    } & PropertyDescriptorMap
) as typeof Array.prototype

reactiveArrayPrototype.copyWithin = function <T>(
    this: Array<T>,
    target: number,
    start: number,
    end: number
): Array<T> {
    Array.prototype.copyWithin.call(this, target, start, end)

    return this
}

reactiveArrayPrototype.fill = function <T>(
    this: Array<T>,
    value: unknown,
    start?: number,
    end?: number
): Array<T> {
    Array.prototype.fill.call(this, value, start, end)

    return this
}

export default function ReactiveArray<T>(array: T[]): T[] {
    return Object.setPrototypeOf(array, reactiveArrayPrototype)
}
