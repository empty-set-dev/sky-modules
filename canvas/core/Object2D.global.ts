import globalify from '@sky-modules/core/globalify'

import Object2D, * as imports from './Object2D'

declare global {
    const Object2D: typeof imports.default
    type Object2D = typeof imports.default
    type Transform2D = imports.Transform2D
}

globalify({ Object2D, ...imports })
