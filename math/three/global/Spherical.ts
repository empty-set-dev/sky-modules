import globalify from '@sky-modules/core/globalify'

import * as imports from '../Spherical'

declare global {
    const Spherical: typeof imports.Spherical
}

globalify({ ...imports })
