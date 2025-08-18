export {}

declare global {
    type Context = (new (...args: unknown[]) => unknown) & {
        context: boolean
    }
}

export type __Context = Context & {
    __name: string
}
