import globalify from '@sky-modules/core/globalify'

import desktop, * as imports from '../desktop'

declare global {
    const desktop: typeof imports.default
    type desktop = typeof imports.default
}

globalify({ desktop })
