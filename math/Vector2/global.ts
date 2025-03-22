import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Vector2: pkg.default })

declare global {
    type Vector2 = pkg.default
    const Vector2: typeof pkg.default
}
