import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ asyncConstructor: pkg.default })

declare global {
    function asyncConstructor<T>(fn: () => Promise<T>): T
}
