import globalify from 'sky/helpers/globalify'

declare global {
    //@ts-ignore
    async function async<T>(fn: () => Promise<T>): T
}

namespace lib {
    //@ts-ignore
    export async function async<T>(fn: () => Promise<T>): T {
        return await fn()
    }
}

globalify(lib)
