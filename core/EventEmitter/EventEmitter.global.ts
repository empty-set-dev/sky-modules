import globalify from '@sky-modules/core/globalify'
import EventEmitter, * as imports from './EventEmitter'

declare global {
    type EventEmitter = typeof imports.default
    const EventEmitter: typeof imports.default
}

globalify({ EventEmitter, ...imports })
