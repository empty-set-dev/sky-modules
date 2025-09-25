import EventEmitter from './_EventEmitter'

EventEmitter.prototype.off = function off<T extends { [K in keyof T]: T[K] }, K extends keyof T>(
    this: EventEmitter<T>,
    ev: K,
    callback: (...args: unknown[]) => void
): EventEmitter<T> {
    const eventsList = this['__listeners'][ev]
    eventsList && eventsList.remove(callback)
    return this
}
