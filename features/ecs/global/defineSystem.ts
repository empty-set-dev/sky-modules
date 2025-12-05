import globalify from '@sky-modules/core/globalify'

import * as imports from '../defineSystem'

declare global {
    const defineSystem: typeof imports.defineSystem
}

globalify({ ...imports })
