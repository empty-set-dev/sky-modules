import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ Vector3: module.default })

declare global {
    class Vector3 extends module.default {}
}
