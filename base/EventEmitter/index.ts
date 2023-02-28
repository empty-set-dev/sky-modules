import globalify from 'base/globalify'

import local from './default'

globalify(local)

export * from './local'
export default EventEmitter

declare global {
    type EventEmitter = local.EventEmitter
    const EventEmitter: typeof local.EventEmitter
}
