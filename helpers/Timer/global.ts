import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ Timer: pkg.default })

declare global {
    class Timer extends pkg.default {}
}
