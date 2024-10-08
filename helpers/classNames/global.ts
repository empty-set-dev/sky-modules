import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ cn: pkg.default })

declare global {
    const cn: typeof pkg.default
}
