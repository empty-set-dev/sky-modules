import globalify from 'sky/core/globalify'

import * as lib from '.'

globalify({ Vector2: lib.default })

declare global {
    class Vector2 extends lib.default {}
}
