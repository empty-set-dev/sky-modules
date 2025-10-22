import globalify from '../globalify'

import as, * as imports from './as'

declare global {
    const as: typeof imports.default & (new () => void)
}

globalify({ as, ...imports })
