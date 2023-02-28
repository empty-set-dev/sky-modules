import { EventEmitter } from "./EventEmitter"

EventEmitter.prototype.on = function(this: EventEmitter, ev: string, fn: Function) {
    const events = (this[$$events] = this[$$events] ?? {})
    const list = (events[ev] = events[ev] ?? [])

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
