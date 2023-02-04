import local from './default'
globalify(local)

declare global {
    type EventEmitter = local.EventEmitter
    const EventEmitter: typeof local.EventEmitter
}
