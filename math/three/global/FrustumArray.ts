import globalify from '@sky-modules/core/globalify'

import * as imports from '../FrustumArray'

declare global {
    const FrustumArray: typeof imports.FrustumArray
}

globalify({ ...imports })
