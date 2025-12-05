import globalify from '@sky-modules/core/globalify'

import * as imports from '../Sphere'

declare global {
    const Sphere: typeof imports.Sphere
}

globalify({ ...imports })
