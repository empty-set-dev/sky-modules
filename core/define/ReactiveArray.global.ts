import globalify from '@sky-modules/core/globalify'

import ReactiveArray, * as imports from './ReactiveArray'

declare global {
    const ReactiveArray: typeof imports.default
}

globalify({ ReactiveArray })
