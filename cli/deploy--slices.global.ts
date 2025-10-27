import globalify from '@sky-modules/core/globalify'

import deploySlices, * as imports from './deploy--slices'

declare global {
    const deploySlices: typeof imports.default
    type deploySlices = typeof imports.default
}

globalify({ deploySlices })
