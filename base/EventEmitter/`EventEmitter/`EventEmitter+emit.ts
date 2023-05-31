import { ObjectIndex } from 'types/defaultly'

import EventEmitter from '../`EventEmitter'

EventEmitter.prototype.emit = function emit(
    this: EventEmitter,
    ev: ObjectIndex,
    ...args: unknown[]
): void {
    const events = this['__events'][ev]

    if (!events) {
        return
    }

    events.forEach((fn: Function) => {
        fn.call(null, ...args)
    })
}
