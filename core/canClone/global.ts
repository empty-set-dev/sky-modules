import globalify from '../globalify'

import canClone, * as imports from './canClone'

declare global {
    const canClone: typeof imports.default
}

globalify({ canClone, ...imports })
