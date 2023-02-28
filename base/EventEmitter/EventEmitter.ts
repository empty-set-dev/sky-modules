import types from 'types'

import $$events from './~EventEmitter/~EventEmitter$$events'

export default class EventEmitter {
    static apply: <T extends unknown[], TT, R>(
        fn: (this: TT, ...args: T) => R
    ) => ((this: TT, ...args: T) => R) & EventEmitter

    on!: (ev: types.ObjectIndex, fn: Function) => () => void
    emit!: (ev: string, ...args: unknown[]) => void

    private [$$events]: Record<types.ObjectIndex, Function[]> = {}
}

import "./~EventEmitter/~EventEmitter'apply"
import './~EventEmitter/~EventEmitter+on'
import './~EventEmitter/~EventEmitter+emit'
