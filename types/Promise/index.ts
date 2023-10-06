export {}

declare global {
    namespace Promise {
        export type Void = Promise<void>
        export type Number = Promise<void>
        export type String = Promise<string>
        export type Record<K, V> = Promise<Record<K, V>>
        export type Array<T> = Promise<Array<T>>
        export type Function = Promise<Function>
    }
}
