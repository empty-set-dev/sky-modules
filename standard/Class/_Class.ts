export {}

declare global {
    type Class<
        T extends new (...args: ConstructorParameters<T>) => InstanceType<T> = new (
            ...args: unknown[]
        ) => unknown,
    > = new (...args: ConstructorParameters<T>) => InstanceType<T>
}
