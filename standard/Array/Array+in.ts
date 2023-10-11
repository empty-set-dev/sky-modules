export {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        has<T>(element: T): Effect
    }
}

Array.prototype.has = function has<T>(this: T[], link: Effects, element: T): Effect {
    this.push(element)
    return atEnd(link)
}
