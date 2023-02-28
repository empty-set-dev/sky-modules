import globalify from 'base/globalify'
import EventEmitter from './EventEmitter'
import local from './default'
export * from './local'
export default EventEmitter
globalify(local)

declare global {
    type EventEmitter = local.EventEmitter
    const EventEmitter: typeof local.EventEmitter
}
