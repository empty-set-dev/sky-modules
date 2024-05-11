export default async function idle(timeout: Time): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, timeout.valueOf() * 1000))
}
