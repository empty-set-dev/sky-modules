import globalify from '@sky-modules/core/globalify'

import EventEmitter, * as imports from '../EventEmitter'

declare global {
    const EventEmitter: typeof imports.default
}

globalify({ EventEmitter })
