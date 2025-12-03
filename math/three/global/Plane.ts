import globalify from '@sky-modules/core/globalify'

import * as imports from '../Plane'

declare global {
    const Plane: typeof imports.Plane
}

globalify({ ...imports })
