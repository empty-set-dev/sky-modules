export default async function until<T, A extends unknown[]>(
    callback: (...args: A) => Promise<T>,
    ...args: A
): Promise<T> {
    return await callback(...args)
}
