// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Array<T> {
    remove<T>(v: T): void
}

Array.prototype.remove = function <T>(this: Array<T>, v: T): void {
    const i = this.indexOf(v)

    if (i === -1) {
        return
    }

    this.splice(i, 1)
}
