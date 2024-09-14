import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ EventEmitter: pkg.default })

declare global {
    class EventEmitter extends pkg.default {}
}
