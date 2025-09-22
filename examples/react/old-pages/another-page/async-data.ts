export default async function data(): Promise<{ x: number }> {
    await idle((1).seconds)
    return { x: 42 }
}
