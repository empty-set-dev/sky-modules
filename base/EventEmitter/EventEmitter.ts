import { $$events } from "./~EventEmitter/~EventEmitter$$events"

export default class EventEmitter {
    private [$$events]?: Record<string, Function[]>

    static apply<T extends any[], TT, R>(fn: (this: TT, ...args: T) => R)

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
