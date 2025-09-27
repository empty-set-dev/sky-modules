import EventEmitter from './_EventEmitter'

EventEmitter.prototype.on = function on<T extends { [K in keyof T]?: T[K] }, K extends keyof T>(
    this: EventEmitter<T>,
    ev: K,
    callback: (...args: unknown[]) => void
): EventEmitter<T> {
    this['__listeners'] ??= {}
    const eventsList = (this['__listeners'][ev] ??= [])
    eventsList.push(callback)
    return this
}
