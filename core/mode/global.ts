import globalify from '@sky-modules/core/globalify'

import MODE, * as imports from './MODE'

declare global {
    const MODE: typeof imports.default
}

globalify({ MODE, ...imports})
