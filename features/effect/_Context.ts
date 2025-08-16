export {}

declare global {
    type Context<T extends Class<T> = Class> = Class<T> & {
        constructor: Function
        context: boolean
    }
}
