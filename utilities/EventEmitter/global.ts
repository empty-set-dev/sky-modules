import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ EventEmitter: lib.default })

declare global {
    class EventEmitter extends lib.default {}
}
