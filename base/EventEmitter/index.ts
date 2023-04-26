import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({ EventEmitter: local.default })

declare global {
    type EventEmitter = local.default
    const EventEmitter: typeof local.default
}
