import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({
    justTry: pkg.default,
})

declare global {
    function justTry<T>(fn: () => T): Promise<undefined | T>
}
