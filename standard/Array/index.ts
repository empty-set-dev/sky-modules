import Array_remove from './defaultly'

Array.prototype.remove = Array_remove

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(v: T): void
    }
}
