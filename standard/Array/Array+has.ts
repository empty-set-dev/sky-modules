export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        has(element: T): Effect
    }
}

Array.prototype.has = effect(<T>function (this: T[], element: T) {
    this.push(element)
    return (): void => this.remove(element)
})
