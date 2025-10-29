import globalify from '@sky-modules/core/globalify'

import Console, * as imports from './Console'

declare global {
    const Console: typeof imports.default
}

globalify({ Console })
