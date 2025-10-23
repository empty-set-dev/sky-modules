import globalify from '@sky-modules/core/globalify'
import makePlain, * as imports from './makePlain'

declare global {
    type makePlain = typeof imports.default
    const makePlain: typeof imports.default
}

globalify({ makePlain, ...imports })
