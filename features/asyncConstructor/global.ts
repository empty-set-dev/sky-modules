import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ asyncConstructor: pkg.default })

declare global {
    function asyncConstructor<T, A extends unknown[]>(
        This: Promise<T> | T,
        asyncConstructor: (this: T, ...args: A) => void,
        ...args: A
    ): T
}
