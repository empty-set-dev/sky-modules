export default class EventEmitter<T extends { [K in keyof T]: T[K] }> {
    static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void {
        self['__events'] = {} as Record<keyof T, undefined | ((...args: unknown[]) => void)[]>
    }
    static extend: <T extends Function, E extends { [K in keyof E]: E[K] }>(
        fn: T
    ) => T & EventEmitter<E>

    private __events: Record<keyof T, undefined | ((...args: unknown[]) => void)[]> = {} as Record<
        keyof T,
        undefined | ((...args: unknown[]) => void)[]
    >

    on<K extends keyof T>(ev: K, callback: Function & T[K]): this {
        ev
        callback
        return null!
    }
    off<K extends keyof T>(ev: K, callback: Function & T[K]): this {
        ev
        callback
        return null!
    }
    emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]>): this {
        ev
        args
        return null!
    }
}
