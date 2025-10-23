export {}

declare global {
    interface Map<K, V> {
        hassume<P extends K>(key: P): this is { get(key: P): V } & this
        // funny thing: `& this` is the final piece of the puzzle
    }
}
