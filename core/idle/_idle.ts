export interface IdleParameters {
    signal?: AbortSignal
}
export default async function idle(timeout: Time, parameters?: IdleParameters): Promise<void> {
    return await new Promise(resolve => {
        const timeoutHandler = setTimeout(resolve, timeout.valueOf() * 1000)
        parameters?.signal?.addEventListener('abort', () => clearTimeout(timeoutHandler))
    })
}
