import types from 'types'

import EventEmitter from '../EventEmitter'
import $$events from './~EventEmitter$$events'

EventEmitter.prototype.on = function (
    this: EventEmitter,
    ev: types.ObjectIndex,
    fn: Function
): () => void {
    const events = (this[$$events] ??= {})
    const list = (events[ev] ??= [])

    list.push(fn)

    return () => {
        const i = list.indexOf(fn)

        if (i < 0) {
            return
        }

        list.splice(i, 1)

        if (list.length === 0) {
            delete events[ev]
        }

        if (!Object.keys(events).length) {
            delete this[$$events]
        }
    }
}
