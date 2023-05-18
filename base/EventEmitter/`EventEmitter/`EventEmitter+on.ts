import { Array_remove } from 'standard/Array/defaultly'
import { ObjectIndex } from 'types/defaultly'

import EventEmitter from '../`EventEmitter'

import $$events from './`EventEmitter$$events'

EventEmitter.prototype.on = function (
    this: EventEmitter,
    ev: ObjectIndex,
    fn: Function
): () => void {
    const events = this[$$events]
    const list = (events[ev] ??= [])

    list.push(fn)

    return () => {
        Array_remove(list, fn)
        list.remove(fn)

        if (!list.length) {
            delete events[ev]
        }
    }
}
