import globalify from '../globalify'

declare global {
    function repeat<A extends unknown[]>(
        count: number,
        callback: (iteration: number, ...args: A) => Promise<void>,
        ...args: A
    ): Promise<void>
    function repeat<A extends unknown[]>(
        count: number,
        callback: (iteration: number, ...args: A) => void,
        ...args: A
    ): void
}

namespace lib {
    export async function repeat<A extends unknown[]>(
        count: number,
        callback: (iteration: number, ...args: A) => void,
        ...args: A
    ): Promise<void> {
        for (let i = 0; i < count; ++i) {
            const result = callback(i, ...args) as void | Promise<void>

            if (result instanceof Promise) {
                await result
            }
        }
    }
}

globalify(lib)
