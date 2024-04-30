export default async function idle(timeout: time): Promise<void> {
    return await new Promise(r => setTimeout(r, timeout.valueOf()))
}
