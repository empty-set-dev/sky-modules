export {}

declare global {
    type Class<
        T extends {
            new (...args: ConstructorParameters<T>): InstanceType<T>
            prototype: InstanceType<T>
        } = { new (...args: unknown[]): unknown; prototype: unknown },
    > = {
        new (...args: ConstructorParameters<T>): InstanceType<T>
        prototype: InstanceType<T>
    }
}
