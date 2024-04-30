export default class EventEmitter {
    static extend: <F>(fn: F) => F & EventEmitter

    on!: (ev: Object.Index, callback: Function) => () => void
    emit!: (ev: string, ...args: unknown[]) => void

    private ['__events']: Record<Object.Index, Function[]> = {}
}
