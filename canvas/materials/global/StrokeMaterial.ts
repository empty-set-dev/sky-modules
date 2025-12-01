import globalify from '@sky-modules/core/globalify'

import * as imports from '../StrokeMaterial'

declare global {
    const StrokeMaterial: typeof imports.StrokeMaterial
}

globalify({ ...imports })
