import globalify from '@sky-modules/core/globalify'

import * as imports from '../events'

declare global {
    const ReactiveEventType: typeof imports.ReactiveEventType
    type ReactiveEvent = imports.ReactiveEvent
    type ReactiveNewEvent<T> = imports.ReactiveNewEvent<T>
    type ReactiveDestroyEvent = imports.ReactiveDestroyEvent
    type ReactiveUpdateEvent<T> = imports.ReactiveUpdateEvent<T>
    type ReactiveDeleteEvent = imports.ReactiveDeleteEvent
}

globalify({ ...imports })
