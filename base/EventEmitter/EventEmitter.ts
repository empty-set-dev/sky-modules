import { $$events } from "./~EventEmitter/~EventEmitter$$events";

export default class EventEmitter {
    static apply: <T extends any[], TT, R>(fn: (this: TT, ...args: T) => R)

    on: (ev: string, fn: Function)
    emit: (ev: string, ...args: any[]) => void

    private[$$events] ?: Record<string, Function[]>
}
