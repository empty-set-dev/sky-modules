import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ classnames: pkg.default })

declare global {
    const classNames: typeof pkg.default
}
