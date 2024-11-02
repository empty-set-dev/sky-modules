export {}

declare global {
    type Class<
        T extends new (...args: ConstructorParameters<T>) => InstanceType<T> = new (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...args: any[]
        ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
    > = new (...args: ConstructorParameters<T>) => InstanceType<T>
}
