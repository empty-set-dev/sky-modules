const $$events = Symbol('events')

export class EventEmitter {
    private [$$events]?: Record<string, Function[]>

    static apply<T extends any[], TT, R>(fn: (this: TT, ...args: T) => R) {
        Object.setPrototypeOf(fn, EventEmitter.prototype)
        return fn as typeof fn & EventEmitter
    }

    on(ev: string, fn: Function) {
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

    emit(ev: string, ...args: any[]) {
        const events = this[$$events] && this[$$events][ev]
        if (!events) {
            return
        }
        events.forEach(fn => {
            fn.call(null, ...args)
        })
    }
}
