import globalify from '@sky-modules/core/globalify'
import justTry, * as imports from './justTry'

declare global {
    type justTry = typeof imports.default
    const justTry: typeof imports.default
}

globalify({ justTry, ...imports })
