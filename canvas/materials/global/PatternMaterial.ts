import globalify from '@sky-modules/core/globalify'

import * as imports from '../PatternMaterial'

declare global {
    const PatternMaterial: typeof imports.PatternMaterial
    type PatternMaterialParameters = imports.PatternMaterialParameters
    type PatternRepetition = imports.PatternRepetition
}

globalify({ ...imports })
