export type Agent<T extends Class<T> = Class<T>> = {
    new (...args: ConstructorParameters<T>): InstanceType<T>
    agent: boolean
}
