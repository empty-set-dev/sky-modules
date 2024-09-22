export {}

declare global {
    type Class<Instance extends unknown, Args extends unknown[]> = {
        new (...args: Args): Instance
    }
}
