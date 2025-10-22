import globalify from '@sky-modules/core/globalify'

import idle, * as imports from '.'

declare global {
    interface IdleParameters extends imports.IdleParameters {}
    const idle: typeof imports.default
}

globalify({ idle, ...imports })
