import globalify from '@sky-modules/core/globalify'

import ClientOnly, * as imports from '../ClientOnly'

declare global {
    const ClientOnly: typeof imports.default
    type ClientOnly = typeof imports.default
}

globalify({ ClientOnly })
