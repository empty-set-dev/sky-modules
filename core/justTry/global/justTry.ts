import globalify from '@sky-modules/core/globalify'

import justTry, * as imports from '../justTry'

declare global {
    const justTry: typeof imports.default
}

globalify({ justTry })
