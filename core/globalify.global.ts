import globalify from 'sky/core/globalify'

import globalify, * as lib from './globalify'

declare global {
    const globalify: typeof lib.default
}

globalify({ globalify, ...lib })
