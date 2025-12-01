import globalify from '@sky-modules/core/globalify'

import Mesh, * as imports from '../Mesh'

declare global {
    const Mesh: typeof imports.default
    type Mesh = typeof imports.default
}

globalify({ Mesh, ...imports })
