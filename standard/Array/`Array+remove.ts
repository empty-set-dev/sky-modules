export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(v: T): void
    }
}

Object.assign(Array.prototype, {
    remove(array: Array<unknown>, v: unknown): boolean {
        const i = array.indexOf(v)

        if (i === -1) {
            return false
        }

        array.splice(i, 1)

        return true
    },
})
