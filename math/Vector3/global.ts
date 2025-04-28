import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Vector3: pkg.default })

declare global {
    class Vector3 extends pkg.default {}
}
