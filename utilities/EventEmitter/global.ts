import 'modules/imports'
import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ EventEmitter: module.default })

declare global {
    class EventEmitter extends module.default {}
}
