/* eslint-disable @typescript-eslint/no-unused-vars */
import emit from './_EventEmitter+emit'
import on from './_EventEmitter+on'
import extend from './_EventEmitter-extend'

export default class EventEmitter {
    static extend: <F>(fn: F) => F & EventEmitter

    on(ev: Object.Index, callback: (...args: unknown[]) => void): () => void {
        return null as never
    }
    emit(ev: Object.Index, ...args: unknown[]): this {
        //@ts-ignore
        return null as never
    }

    private __events: Record<Object.Index, ((...args: unknown[]) => void)[]> = {}
}

EventEmitter.extend = extend
EventEmitter.prototype.on = on
EventEmitter.prototype.emit = emit
