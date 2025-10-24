import globalify from '@sky-modules/core/globalify'

import reaction, * as imports from './reaction'

declare global {
    const reaction: typeof imports.default
    type reaction = typeof imports.default
}

globalify({ reaction })
