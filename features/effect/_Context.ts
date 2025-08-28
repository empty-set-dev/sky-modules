export {}

declare global {
    type ContextConstructor = { new (...args: any[]): any; context: true }
}

export type __ContextConstructor = ContextConstructor & {
    __name: string
    constructor: object
}
