import globalify from '@sky-modules/core/globalify'

import * as imports from './transform'

declare global {
    const defineTransform: typeof imports.defineTransform
    const to: typeof imports.to
    const from: typeof imports.from
    const transform: typeof imports.transform
    type Transform = typeof imports.Transform
    type transform = typeof imports.transform
}

globalify({ ...imports })
