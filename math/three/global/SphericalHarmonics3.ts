import globalify from '@sky-modules/core/globalify'

import * as imports from '../SphericalHarmonics3'

declare global {
    const SphericalHarmonics3: typeof imports.SphericalHarmonics3
}

globalify({ ...imports })
