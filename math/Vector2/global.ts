import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ Vector2: module.default })

declare global {
    class Vector2 extends module.default {}
}
