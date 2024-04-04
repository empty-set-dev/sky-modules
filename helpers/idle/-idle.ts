export default async function idle(timeout: number): Promise<void> {
    return await new Promise(r => setTimeout(r, timeout))
}
