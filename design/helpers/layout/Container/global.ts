import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    const Container: typeof lib.default
}

globalify(lib)
