import globalify from 'sky/core/globalify'

import * as lib from '.'

declare global {
    const Container: typeof lib.default
}

globalify(lib)
