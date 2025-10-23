import globalify from '@sky-modules/core/globalify'
import idle, * as imports from './idle'

declare global {
    type idle = typeof imports.default
    const idle: typeof imports.default
    type IdleParameters = typeof imports.IdleParameters
}

globalify({ idle, ...imports })
