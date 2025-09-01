import EventEmitter from './_EventEmitter'

EventEmitter.prototype.on = function on<T extends { [K in keyof T]?: T[K] }, K extends keyof T>(
    this: EventEmitter<T>,
    ev: K,
    callback: (...args: unknown[]) => void
): EventEmitter<T> {
    this['__events'] ??= {} as Record<keyof T, undefined | ((...args: unknown[]) => void)[]>
    const eventsList = (this['__events'][ev] ??= [])
    eventsList.push(callback)
    return this
}
