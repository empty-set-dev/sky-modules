export {}

declare global {
    type Context<T extends Class<T> = Class> = Class<T> & {
        context: boolean
        __name: string
    }
}
