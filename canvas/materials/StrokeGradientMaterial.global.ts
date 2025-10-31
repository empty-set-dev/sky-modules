import globalify from '@sky-modules/core/globalify'

import * as imports from './StrokeGradientMaterial'

declare global {
    const StrokeGradientMaterial: typeof imports.StrokeGradientMaterial
    type StrokeGradientMaterialParameters = imports.StrokeGradientMaterialParameters
}

globalify({ ...imports })
