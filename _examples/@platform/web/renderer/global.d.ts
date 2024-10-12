export {}

declare global {
    var afterHydration: boolean
    var ip: string

    interface ImportMeta {
        readonly env: {
            [x: string]: undefined | string
        }
    }
}
