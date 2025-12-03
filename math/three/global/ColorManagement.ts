import globalify from '@sky-modules/core/globalify'

import * as imports from '../ColorManagement'

declare global {
    const SRGBToLinear: typeof imports.SRGBToLinear
    const LinearToSRGB: typeof imports.LinearToSRGB
    const ColorManagement: typeof imports.ColorManagement
}

globalify({ ...imports })
