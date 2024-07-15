import globalify from 'sky/helpers/globalify'

import * as module_ from '.'

globalify({ EventEmitter: module_.default })

declare global {
    class EventEmitter extends module_.default {}
}
