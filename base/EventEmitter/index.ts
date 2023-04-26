import globalify from 'base/globalify'

import * as local from './defaultly'

globalify(local)

declare global {
    type EventEmitter = local.default
    const EventEmitter: typeof local.default
}
