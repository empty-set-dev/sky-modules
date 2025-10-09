import * as lib from '.'

declare global {
    const fire: typeof lib.fire
    const task: typeof lib.task
    const handleAsyncError: typeof lib.handleAsyncError
    let onAsyncError: (error: unknown) => void
}

Object.assign(global, lib)
Object.assign(global, { onAsyncError: lib.handleAsyncError })
