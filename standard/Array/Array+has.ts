import 'features/ECS.global'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        has(link: Effects, element: T): Effect
    }
}

Array.prototype.has = effect(function <T>(this: T[], resolve, element: T) {
    this.push(element)
    return (): void => this.remove(element)
})
