import globalify from 'sky/utilities/globalify'

import * as lib from '.'

declare global {
    const Container: typeof lib.default
}

globalify(lib)
