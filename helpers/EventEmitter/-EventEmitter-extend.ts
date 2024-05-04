import EventEmitter from './-EventEmitter'

export default function extend<F>(fn: F): F & EventEmitter {
    const prototype = Object.create(Object.getPrototypeOf(fn))
    Object.assign(prototype, EventEmitter.prototype)
    Object.setPrototypeOf(fn, prototype)

    fn['__events'] = {}

    return fn as F & EventEmitter
}
