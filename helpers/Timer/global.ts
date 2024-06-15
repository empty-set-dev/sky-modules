import globalify from 'sky/helpers/globalify'

import * as module from '.'

globalify({ Timer: module.default })

declare global {
    class Timer extends module.default {}
}
