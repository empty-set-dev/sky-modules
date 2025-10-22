import * as imports from '.'

declare global {
    const fire: typeof imports.fire
    const task: typeof imports.task
    const handleAsyncError: typeof imports.handleAsyncError
    let onAsyncError: (err: unknown) => void
}

Object.assign(global, imports)
Object.assign(global, { onAsyncError: imports.handleAsyncError })
