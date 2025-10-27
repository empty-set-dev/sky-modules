import globalify from '@sky-modules/core/globalify'

import doc, * as imports from './doc'

declare global {
    const doc: typeof imports.default
    type doc = typeof imports.default
}

globalify({ doc })
