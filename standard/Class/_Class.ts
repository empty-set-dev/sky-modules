export {}

declare global {
    type Class<T> = T extends {
        new (...args: infer A): infer I
        prototype: infer P
    }
        ? { new (...args: A): I; prototype: P }
        : never
}
