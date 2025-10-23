import globalify from '@sky-modules/core/globalify'

import idle, * as imports from './idle'

declare global {
    const idle: typeof imports.default
    type IdleParameters = imports.IdleParameters
}

globalify({ idle, ...imports })
