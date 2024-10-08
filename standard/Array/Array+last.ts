export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        last<T>(element: T): boolean
    }
}

Array.prototype.last = function last<T>(this: T[]): T {
    return this[this.length - 1]
}
