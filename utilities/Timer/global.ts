import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ Timer: lib.default })

declare global {
    class Timer extends lib.default {}
}
