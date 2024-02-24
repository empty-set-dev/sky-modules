export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        remove<T>(element: T): boolean
    }
}

Array.prototype.remove = function remove<T>(this: T[], element: T): boolean {
    const elementIndex = this.indexOf(element)

    if (elementIndex === -1) {
        return false
    }

    this.splice(elementIndex, 1)

    return true
}
