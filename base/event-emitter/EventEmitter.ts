const $$events = Symbol('events')

export class EventEmitter {
    private [$$events]?: Record<string, Function[]>

    static apply<T extends any[], TT, R>(fn: (this: TT, ...args: T) => R) {
        Object.setPrototypeOf(fn, EventEmitter.prototype)

        return fn as typeof fn & EventEmitter
    }

    on(ev: string, fn: Function)

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
