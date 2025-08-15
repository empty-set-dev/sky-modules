import EventEmitter from './_EventEmitter'

EventEmitter.prototype.off = function off(
    this: EventEmitter,
    ev: Object.Index,
    callback: (...args: unknown[]) => void
): EventEmitter {
    const eventsList = this['__events'][ev]
    eventsList && eventsList.remove(callback)
    return this
}
