export {}

declare global {
    type Class<T = new (...args: unknown[]) => object> = T extends {
        new (...args: infer A): infer I
    }
        ? new (...args: A) => I
        : never
}
