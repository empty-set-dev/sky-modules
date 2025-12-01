import globalify from '@sky-modules/core/globalify'

import * as imports from '../jsx-dev-runtime'

declare global {
    const jsxDEV: typeof imports.jsxDEV
    const Fragment: typeof imports.Fragment
}

globalify({ ...imports })
