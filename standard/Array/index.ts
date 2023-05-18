import * as local from './defaultly'

Array.prototype.remove = function (v: unknown): boolean {
    return local.Array__remove(this, v)
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(v: T): void
    }
}
