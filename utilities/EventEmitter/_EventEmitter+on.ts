import EventEmitter from './_EventEmitter'

EventEmitter.prototype.on = function on(
    this: EventEmitter,
    ev: Object.Index,
    callback: (...args: unknown[]) => void
): EventEmitter {
    this['__events'] ??= {}
    const eventsList = (this['__events'][ev] ??= [])
    eventsList.push(callback)
    return this
}
