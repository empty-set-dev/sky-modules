import globalify from '@sky-modules/core/globalify'

import assume, * as imports from './assume'

declare global {
    const assume: typeof imports.default
    type assume = typeof imports.default
}

globalify({ assume, ...imports })
