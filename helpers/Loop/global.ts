import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ Loop: lib.default })

declare global {
    class Loop extends lib.default {}
}
