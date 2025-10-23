import globalify from '@sky-modules/core/globalify'

import makePlain, * as imports from './makePlain'

declare global {
    const makePlain: typeof imports.default
}

globalify({ makePlain, ...imports })
