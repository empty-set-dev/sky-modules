import globalify from '@sky-modules/core/globalify'

import * as imports from '../jsx-runtime'

declare global {
    const jsx: typeof imports.jsx
    const Fragment: typeof imports.Fragment
}

globalify({ ...imports })
