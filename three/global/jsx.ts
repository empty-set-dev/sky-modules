import globalify from '@sky-modules/core/globalify'

import * as imports from '../jsx'

declare global {
    const ThreeJSXRenderer: typeof imports.ThreeJSXRenderer
}

globalify({ ...imports })
