import 'features/ECS/global'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        has(link: Link, element: T): Effect
    }
}

Array.prototype.has = defineEffect(function <T>(this: T[], resolve, element: T) {
    this.push(element)
    return (): void => {
        this.remove(element)
    }
})
