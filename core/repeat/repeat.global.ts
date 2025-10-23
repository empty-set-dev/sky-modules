import globalify from '@sky-modules/core/globalify'
import repeat, * as imports from './repeat'

declare global {
    type repeat = typeof imports.default
    const repeat: typeof imports.default
}

globalify({ repeat, ...imports })
