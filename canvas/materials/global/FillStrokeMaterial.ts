import globalify from '@sky-modules/core/globalify'

import * as imports from '../FillStrokeMaterial'

declare global {
    const FillStrokeMaterial: typeof imports.FillStrokeMaterial
}

globalify({ ...imports })
