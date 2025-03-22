import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Timer: pkg.default })

declare global {
    class Timer extends pkg.default {}
}
