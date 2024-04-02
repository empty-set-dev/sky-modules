import EventEmitter from './-EventEmitter'

EventEmitter.extend = function extend<F>(obj: F): F & EventEmitter {
    const prototype = Object.create(Object.getPrototypeOf(obj))
    Object.assign(prototype, EventEmitter.prototype)
    Object.setPrototypeOf(obj, prototype)

    obj['__events'] = {}

    return obj as F & EventEmitter
}
