import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ Vector3: pkg.default })

declare global {
    const Vector3: typeof pkg.default
}
