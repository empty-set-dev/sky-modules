import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ Vector3: lib.default })

declare global {
    class Vector3 extends lib.default {}
}
