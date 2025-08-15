export default class EventEmitter {
    static super(): void {
        //
    }
    static extend: <F>(fn: F) => F & EventEmitter

    on(ev: Object.Index, callback: (...args: unknown[]) => void): this {
        ev
        callback
        return null!
    }
    off(ev: Object.Index, callback: (...args: unknown[]) => void): this {
        ev
        callback
        return null!
    }
    emit(ev: Object.Index, ...args: unknown[]): this {
        ev
        args
        return null!
    }

    private __events: Record<Object.Index, ((...args: unknown[]) => void)[]> = {}
}

import './_EventEmitter-extend'
import './_EventEmitter+emit'
import './_EventEmitter+off'
import './_EventEmitter+on'
