import globalify from 'utilities/globalify'

import * as module from './Timer'

globalify({ Timer: module.default })

declare global {
    class Timer extends module.default {}
}
