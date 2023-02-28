import types from 'types'

import $$events from './~EventEmitter/~EventEmitter$$events'
import "./~EventEmitter/~EventEmitter'apply"
import './~EventEmitter/~EventEmitter+emit'
import './~EventEmitter/~EventEmitter+on'

export default class EventEmitter {
    static apply: <T extends any[], TT, R>(
        fn: (this: TT, ...args: T) => R
    ) => ((this: TT, ...args: T) => R) & EventEmitter

    on!: (ev: types.ObjectIndex, fn: Function) => () => void
    emit!: (ev: string, ...args: any[]) => void

    private [$$events]: Record<types.ObjectIndex, Function[]> = {}
}
