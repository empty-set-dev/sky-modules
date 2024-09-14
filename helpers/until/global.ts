import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ until: pkg.default })

declare global {
    function until<T, A extends unknown[]>(
        callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
        ...args: A
    ): Promise<T>
}
