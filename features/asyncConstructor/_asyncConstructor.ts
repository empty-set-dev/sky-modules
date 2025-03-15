export default async function asyncConstructor<T, A extends unknown[]>(
    This: Promise<T> | T,
    asyncConstructor: (this: T, ...args: A) => void,
    ...args: A
): Promise<T> {
    await asyncConstructor.call(await This, ...args)
    return await This
}
