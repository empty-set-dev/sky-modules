export {}

declare global {
    type Class<Instance extends unknown = unknown, Args extends unknown[] = unknown[]> = {
        new (...args: Args): Instance
    }
}
