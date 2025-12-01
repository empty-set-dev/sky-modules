import globalify from '@sky-modules/core/globalify'

import Internal, * as imports from '../runtime'

declare global {
    const Internal: typeof imports.default
}

globalify({ Internal })
