import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({
    justTry: module.default,
})

declare global {
    function justTry<T>(fn: () => T): Promise<undefined | T>
}
