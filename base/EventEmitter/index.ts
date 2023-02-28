import local from './default'
import globalify from 'base/globalify'

globalify(local)

export * from './local'
export default EventEmitter

declare global {
    type EventEmitter = local.EventEmitter
    const EventEmitter: typeof local.EventEmitter
}
