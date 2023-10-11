export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(element: T): void
    }
}

Object.assign(Array.prototype, {
    remove(array: Array<unknown>, element: unknown): boolean {
        const elementIndex = array.indexOf(element)

        if (elementIndex === -1) {
            return false
        }

        array.splice(elementIndex, 1)

        return true
    },
})
