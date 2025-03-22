import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ EventEmitter: pkg.default })

declare global {
    class EventEmitter extends pkg.default {}
}
