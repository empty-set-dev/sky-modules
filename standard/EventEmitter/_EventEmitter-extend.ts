import EventEmitter from './_EventEmitter'

EventEmitter.extend = function extend<T extends Function, E extends { [K in keyof E]: E[K] }>(
    fn: T
): T & EventEmitter<E> {
    as<T & EventEmitter<E>>(fn)

    const prototype = Object.create(Object.getPrototypeOf(fn))
    Object.assign(prototype, {
        on: EventEmitter.prototype.on,
        off: EventEmitter.prototype.on,
        emit: EventEmitter.prototype.emit,
    })
    Object.setPrototypeOf(fn, prototype)
    fn['__events'] = {} as Record<keyof E, undefined | ((...args: unknown[]) => void)[]>
    return fn as T & EventEmitter<E>
}
