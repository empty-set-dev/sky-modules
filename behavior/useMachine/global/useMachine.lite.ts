import globalify from '@sky-modules/core/globalify'

import * as imports from '../useMachine.lite'

declare global {
    const useMachine: typeof imports.useMachine
}

globalify({ ...imports })
