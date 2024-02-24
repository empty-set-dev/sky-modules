import EventEmitter from './-EventEmitter'

EventEmitter.extend = function extend<F>(fn: F): F & EventEmitter {
    Object.setPrototypeOf(fn, EventEmitter.prototype)
    fn['__events'] = {}

    return fn as F & EventEmitter
}
