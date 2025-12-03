import globalify from '@sky-modules/core/globalify'

import * as imports from '../Systems'

declare global {
    const Systems: typeof imports.Systems
}

globalify({ ...imports })
