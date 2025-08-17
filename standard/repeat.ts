import globalify from 'sky/utilities/globalify'

declare global {
    function repeat<A extends unknown[]>(
        count: number,
        callback: (...args: A) => Promise<void>,
        ...args: A
    ): Promise<void>
    function repeat<A extends unknown[]>(
        count: number,
        callback: (...args: A) => void,
        ...args: A
    ): void
}

namespace lib {
    export async function repeat<A extends unknown[]>(
        count: number,
        callback: (...args: A) => void,
        ...args: A
    ): Promise<void> {
        for (let i = 0; i < count; ++i) {
            const result = callback(...args) as void | Promise<void>

            if (result instanceof Promise) {
                await result
            }
        }
    }
}

globalify(lib)
