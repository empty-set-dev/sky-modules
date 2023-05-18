import { ObjectIndex } from 'types/defaultly'

import EventEmitter from '../`EventEmitter'

import $$events from './`EventEmitter$$events'

EventEmitter.prototype.emit = function (
    this: EventEmitter,
    ev: ObjectIndex,
    ...args: unknown[]
): void {
    const events = this[$$events][ev]

    if (!events) {
        return
    }

    events.forEach((fn: Function) => {
        fn.call(null, ...args)
    })
}
