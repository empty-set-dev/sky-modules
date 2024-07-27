import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ Timer: lib.default })

declare global {
    class Timer extends lib.default {}
}
