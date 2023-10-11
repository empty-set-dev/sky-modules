import { ObjectIndex } from 'standard/Object'

export default class EventEmitter {
    static extend: <T extends unknown[], TT, R>(
        fn: (this: TT, ...args: T) => R
    ) => ((this: TT, ...args: T) => R) & EventEmitter

    on!: (ev: ObjectIndex, fn: Function) => () => void
    emit!: (ev: string, ...args: unknown[]) => void

    private ['__events']: Record<ObjectIndex, Function[]> = {}
}
