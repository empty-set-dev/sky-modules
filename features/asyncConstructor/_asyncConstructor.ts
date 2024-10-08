//@ts-ignore
export default async function asyncConstructor<T>(fn: () => Promise<T>): T {
    return await fn()
}
