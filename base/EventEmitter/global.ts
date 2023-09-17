import globalify from 'base/globalify'

import * as module from '.'

globalify({ EventEmitter: module.default })

declare global {
    type EventEmitter = module.default
    const EventEmitter: typeof module.default
}
