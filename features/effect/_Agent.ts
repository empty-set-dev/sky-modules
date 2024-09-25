type Agent<
    T extends Class<InstanceType<T>, ConstructorParameters<T>> = Class<
        InstanceType<T>,
        ConstructorParameters<T>
    >
> = {
    new (...args: ConstructorParameters<T>): InstanceType<T>
    agent: string
}
