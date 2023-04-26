import types from 'types'
import 'standard/Array/remove'

import EventEmitter from '../EventEmitter'

import $$events from './`EventEmitter$$events'

EventEmitter.prototype.on = function (
    this: EventEmitter,
    ev: types.ObjectIndex,
    fn: Function
): () => void {
    const events = this[$$events]
    const list = (events[ev] ??= [])

    list.push(fn)

    return () => {
        list.remove(fn)

        if (!list.length) {
            delete events[ev]
        }
    }
}
