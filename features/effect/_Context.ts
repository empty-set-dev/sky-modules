export {}

declare global {
    type Context<T extends Class = Class> = {
        new (...args: ConstructorParameters<T>): InstanceType<T>
        context: true
    }
}
