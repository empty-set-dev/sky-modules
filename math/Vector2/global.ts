import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Vector2: pkg.default })

declare global {
    class Vector2 extends pkg.default {}
}
