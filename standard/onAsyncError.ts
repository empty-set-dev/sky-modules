export {}

declare global {
    function onAsyncError(error: unknown): Promise<void>
}
