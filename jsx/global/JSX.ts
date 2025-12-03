import globalify from '@sky-modules/core/globalify'

import JSX from '../JSX'

declare global {
    const JSX: typeof JSX
    type JSX = typeof JSX
}

globalify({ JSX })
