export default async function justTry<T>(fn: () => T): Promise<undefined | T> {
    try {
        return await fn()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return undefined
    }
}
