import { EventEmitter } from "../EventEmitter"

EventEmitter.apply = function <T extends any[], TT, R>(fn: (this: TT, ...args: T) => R) {
    Object.setPrototypeOf(fn, EventEmitter.prototype)

    return fn as typeof fn & EventEmitter
}
