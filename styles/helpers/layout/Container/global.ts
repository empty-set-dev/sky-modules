import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    const Container: typeof lib.default
}

globalify(lib)
