import globalify from '@sky-modules/core/globalify'
import repeat, * as imports from './repeat'

declare global {
    const repeat: typeof imports.default
}

globalify({ repeat, ...imports })
