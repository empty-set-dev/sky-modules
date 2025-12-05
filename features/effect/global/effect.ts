import globalify from '@sky-modules/core/globalify'

import Effect, * as imports from '../Effect'

declare global {
    const Effect: typeof imports.default
    type Effect = typeof imports.default
}

globalify({ Effect })
