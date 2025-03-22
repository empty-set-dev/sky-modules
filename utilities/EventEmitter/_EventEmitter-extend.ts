import EventEmitter from './_EventEmitter'

export default function extend<F>(fn: F): F & EventEmitter {
    const prototype = Object.create(Object.getPrototypeOf(fn))
    Object.assign(prototype, {
        on: EventEmitter.prototype.on,
        emit: EventEmitter.prototype.emit,
    })
    Object.setPrototypeOf(fn, prototype)
    ;(fn as EventEmitter)['__events'] = {}
    return fn as F & EventEmitter
}
