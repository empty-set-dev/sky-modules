import globalify from '@sky-modules/core/globalify'
import mergeNamespace, * as imports from './mergeNamespace'

declare global {
    type mergeNamespace = typeof imports.default
    const mergeNamespace: typeof imports.default
}

globalify({ mergeNamespace, ...imports })
