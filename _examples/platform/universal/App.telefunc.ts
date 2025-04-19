import '#/server'

export async function onTest(x: number): Promise<void> {
    logConsole(x)
}
