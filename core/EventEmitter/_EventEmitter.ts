export default class EventEmitter<T extends { [K in keyof T]: T[K] }> {
    static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void {
        self['__listeners'] = {} as Record<keyof T, undefined | ((...args: unknown[]) => void)[]>
    }
    static extend: <T extends Function, E extends { [K in keyof E]: E[K] }>(
        fn: T
    ) => T & EventEmitter<E>

    private __listeners: Record<keyof T, undefined | ((...args: unknown[]) => void)[]> =
        {} as Record<keyof T, undefined | ((...args: unknown[]) => void)[]>

    on<K extends keyof T>(ev: K, callback: T[K]): this {
        ev
        callback
        return null!
    }
    onAny<T extends []>(callback: (...args: T) => void): this {
        callback
        return null!
    }
    off<K extends keyof T>(ev: K, callback: T[K]): this {
        ev
        callback
        return null!
    }
    offAll(): this {
        return null!
    }
    emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]>): this {
        ev
        args
        return null!
    }
}
