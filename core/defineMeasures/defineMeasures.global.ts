import globalify from '@sky-modules/core/globalify'

import defineMeasures, * as imports from './defineMeasures'

declare global {
    const defineMeasures: typeof imports.default
}

globalify({ defineMeasures })
