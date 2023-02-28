import $$events from './~EventEmitter$$events'
import types from 'types'

EventEmitter.prototype.emit = function (
    this: EventEmitter,
    ev: types.ObjectIndex,
    ...args: any[]
): void {
    const events = this[$$events] && this[$$events][ev]

    if (!events) {
        return
    }

    events.forEach((fn: Function) => {
        fn.call(null, ...args)
    })
}
