import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ until: lib.default })

declare global {
    function until<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
}
