export default async function repeat<A extends unknown[]>(
    count: number,
    callback: (iteration: number, ...args: A) => void,
    ...args: A
): Promise<void> {
    for (let i = 0; i < count; ++i) {
        const result = callback(i, ...args) as void | Promise<void>

        if (result instanceof Promise) {
            await result
        }
    }
}
