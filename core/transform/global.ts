import globalify from '../globalify'

import * as imports from './transform'

declare global {
    type Transform = keyof typeof imports.to & keyof typeof imports.from
    namespace to {}
    namespace from {}
    const defineTransform: typeof imports.defineTransform
    type transform = typeof imports.transform
    const transform: typeof imports.transform
}

globalify(imports)
