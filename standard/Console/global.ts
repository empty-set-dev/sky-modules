import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    const Console: typeof lib.default
}

Object.assign(console, lib.default)

globalify({ Console: lib.default })
