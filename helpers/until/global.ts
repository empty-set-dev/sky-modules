import globalify from 'sky/helpers/globalify'

import * as module from '.'

globalify({ until: module.default })

declare global {
    function until<T, A extends unknown[]>(
        callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
        ...args: A
    ): Promise<T>
}
