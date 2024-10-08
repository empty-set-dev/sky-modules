export {}

declare global {
    type Context<T extends Class<T> = Class> = {
        new (...args: ConstructorParameters<T>): InstanceType<T>
        context: boolean
    }
}
