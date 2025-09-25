import EventEmitter from './_EventEmitter'

EventEmitter.prototype.emit = function emit<T extends { [K in keyof T]: T[K] }, K extends keyof T>(
    this: EventEmitter<T>,
    ev: K,
    ...args: Parameters<T[K]> & []
): EventEmitter<T> {
    const eventsList = this['__events'][ev]
    eventsList && eventsList.forEach(cb => cb(...args))
    return this
}
