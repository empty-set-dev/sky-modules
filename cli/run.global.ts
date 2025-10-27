import globalify from '@sky-modules/core/globalify'

import run, * as imports from './run'

declare global {
    const run: typeof imports.default
    type run = typeof imports.default
}

globalify({ run })
