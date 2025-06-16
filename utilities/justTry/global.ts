import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({
    justTry: lib.default,
})

declare global {
    function justTry<T>(fn: () => T): Promise<undefined | T>
}
