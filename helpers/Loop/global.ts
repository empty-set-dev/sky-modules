import globalify from 'sky/core/globalify'

import * as lib from '.'

globalify({ Loop: lib.default })

declare global {
    class Loop extends lib.default {}
}
