import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ classnames: lib.default })

declare global {
    const classnames: typeof lib.default
}
