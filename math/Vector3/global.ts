import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ Vector3: lib.default })

declare global {
    class Vector3 extends lib.default {}
}
