import globalify from '@sky-modules/core/globalify'
import globalify, * as imports from './globalify'

declare global {
    type globalify = typeof imports.default
    const globalify: typeof imports.default
}

globalify({ globalify, ...imports })
