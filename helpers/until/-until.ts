export default async function until<T, A extends unknown[]>(
    callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
    ...args: A
): Promise<T> {
    return new Promise(r => callback(r, ...args))
}
