import globalify from '@sky-modules/core/globalify'

import * as imports from './GradientMaterial'

declare global {
    const GradientMaterial: typeof imports.GradientMaterial
    type GradientMaterialParameters = imports.GradientMaterialParameters
}

globalify({ ...imports })
