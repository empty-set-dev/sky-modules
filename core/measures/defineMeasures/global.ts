import globalify from '@sky-modules/core/globalify'

import defineMeasures from '.'

declare global {
    const defineMeasures: typeof import('.').default
}

globalify({ defineMeasures })
