import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ until: module.default })

declare global {
    function until<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
}
