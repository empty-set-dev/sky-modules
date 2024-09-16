/* eslint-disable @typescript-eslint/no-unused-vars */
import emit from './-EventEmitter+emit'
import on from './-EventEmitter+on'
import extend from './-EventEmitter-extend'

export default class EventEmitter {
    static extend: <F>(fn: F) => F & EventEmitter

    on(ev: Object.Index, callback: (...args: unknown[]) => void): () => void {
        //@ts-ignore
        return
    }
    emit(ev: Object.Index, ...args: unknown[]): this {
        //@ts-ignore
        return
    }

    private ['__events']: Record<Object.Index, ((...args: unknown[]) => void)[]> = {}
}

EventEmitter.extend = extend
EventEmitter.prototype.on = on
EventEmitter.prototype.emit = emit
