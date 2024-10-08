import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ Vector2: pkg.default })

declare global {
    const Vector2: typeof pkg.default
}
