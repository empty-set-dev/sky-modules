export {}

declare global {
    interface Array<T> {
        remove(element: T): boolean
    }
}

Object.defineProperty(Array.prototype, 'remove', {
    value: function remove<T>(this: T[], element: T): boolean {
        const elementIndex = this.indexOf(element)

        if (elementIndex === -1) {
            return false
        }

        this.splice(elementIndex, 1)

        return true
    },
    enumerable: false,
    writable: true,
    configurable: true,
})
