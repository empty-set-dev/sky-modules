import * as module from '.'

Array.prototype.remove = function (v: unknown): boolean {
    return module.Array_remove(this, v)
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(v: T): void
    }
}
