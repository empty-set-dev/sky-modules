import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Vector3: pkg.default })

declare global {
    type Vector3 = pkg.default
    const Vector3: typeof pkg.default
}
